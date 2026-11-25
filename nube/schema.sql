-- =====================================================================
-- Civora · esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar completo en: Supabase > SQL Editor > New query > Run
-- Se puede ejecutar más de una vez sin romper nada (es idempotente).
-- =====================================================================

-- ---------- 1. Tablas -------------------------------------------------

create table if not exists public.perfiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  correo          text not null,
  nombre          text not null default 'Vecino',
  rol             text not null default 'vecino' check (rol in ('vecino', 'directiva')),
  residencial     text not null default 'Residencial Las Palmas',
  pasaje_poligono text,
  creado_en       timestamptz not null default now()
);

create table if not exists public.reportes (
  id              uuid primary key default gen_random_uuid(),
  numero          bigint generated always as identity,
  autor_id        uuid not null references public.perfiles (id) on delete cascade,
  categoria       text not null check (categoria in ('bache', 'basura', 'alumbrado', 'otro')),
  estado          text not null default 'pendiente' check (estado in ('pendiente', 'en_proceso', 'resuelto')),
  titulo          text not null,
  descripcion     text,
  ubicacion_texto text not null,
  latitud         double precision,
  longitud        double precision,
  foto_url        text,
  nota            text,
  residencial     text not null default 'Residencial Las Palmas',
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now()
);

create table if not exists public.historial_estados (
  id          uuid primary key default gen_random_uuid(),
  reporte_id  uuid not null references public.reportes (id) on delete cascade,
  estado      text not null check (estado in ('pendiente', 'en_proceso', 'resuelto')),
  nota        text,
  autor_id    uuid references public.perfiles (id) on delete set null,
  creado_en   timestamptz not null default now()
);

create index if not exists reportes_autor_idx   on public.reportes (autor_id);
create index if not exists reportes_estado_idx  on public.reportes (estado);
create index if not exists reportes_creado_idx  on public.reportes (creado_en desc);
create index if not exists historial_reporte_idx on public.historial_estados (reporte_id, creado_en);

-- ---------- 2. Funciones y disparadores -------------------------------

-- ¿El usuario actual es de la directiva? (el rol vive en la base, NO en el correo)
create or replace function public.es_directiva()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles p where p.id = auth.uid() and p.rol = 'directiva'
  );
$$;

-- Al registrarse un usuario se crea su perfil automáticamente (siempre como vecino).
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, correo, nombre, residencial, pasaje_poligono)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'nombre', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data ->> 'residencial', ''), 'Residencial Las Palmas'),
    nullif(new.raw_user_meta_data ->> 'pasaje_poligono', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- Al crear un reporte se registra el primer estado en el historial.
create or replace function public.historial_al_crear_reporte()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.historial_estados (reporte_id, estado, autor_id, creado_en)
  values (new.id, new.estado, new.autor_id, new.creado_en);
  return new;
end;
$$;

drop trigger if exists al_crear_reporte on public.reportes;
create trigger al_crear_reporte
  after insert on public.reportes
  for each row execute function public.historial_al_crear_reporte();

-- Al cambiar el estado se registra en el historial y se actualiza la fecha.
create or replace function public.historial_al_cambiar_estado()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.actualizado_en := now();
  if new.estado is distinct from old.estado then
    insert into public.historial_estados (reporte_id, estado, nota, autor_id)
    values (new.id, new.estado, new.nota, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists al_cambiar_estado on public.reportes;
create trigger al_cambiar_estado
  before update on public.reportes
  for each row execute function public.historial_al_cambiar_estado();

-- ---------- 3. Seguridad por filas (RLS) ------------------------------

alter table public.perfiles          enable row level security;
alter table public.reportes          enable row level security;
alter table public.historial_estados enable row level security;

-- perfiles: cada quien ve el suyo; la directiva ve todos. Nadie edita su rol desde la app.
drop policy if exists perfiles_ver on public.perfiles;
create policy perfiles_ver on public.perfiles
  for select to authenticated
  using (id = auth.uid() or public.es_directiva());

-- reportes: todos los usuarios con sesión ven los de la residencial (HU03).
drop policy if exists reportes_ver on public.reportes;
create policy reportes_ver on public.reportes
  for select to authenticated using (true);

-- reportes: solo se crean a nombre propio y siempre en estado pendiente (HU01).
drop policy if exists reportes_crear on public.reportes;
create policy reportes_crear on public.reportes
  for insert to authenticated
  with check (autor_id = auth.uid() and estado = 'pendiente');

-- reportes: solo la directiva cambia el estado (HU06).
drop policy if exists reportes_actualizar on public.reportes;
create policy reportes_actualizar on public.reportes
  for update to authenticated
  using (public.es_directiva())
  with check (public.es_directiva());

-- historial: lectura para todos con sesión; se escribe solo por los disparadores.
drop policy if exists historial_ver on public.historial_estados;
create policy historial_ver on public.historial_estados
  for select to authenticated using (true);

-- ---------- 4. Almacenamiento de fotos --------------------------------

insert into storage.buckets (id, name, public)
values ('fotos-reportes', 'fotos-reportes', true)
on conflict (id) do nothing;

-- Lectura pública de fotos (la URL se guarda en reportes.foto_url).
drop policy if exists fotos_ver on storage.objects;
create policy fotos_ver on storage.objects
  for select using (bucket_id = 'fotos-reportes');

-- Subir solo dentro de la carpeta propia: <id_usuario>/<archivo>
drop policy if exists fotos_subir on storage.objects;
create policy fotos_subir on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'fotos-reportes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------- 5. Permisos de las tablas para la API ---------------------

grant usage on schema public to anon, authenticated;
grant select on public.perfiles, public.reportes, public.historial_estados to authenticated;
grant insert, update on public.reportes to authenticated;

-- =====================================================================
-- DESPUÉS DE REGISTRAR LA CUENTA DE LA DIRECTIVA (una sola vez, a mano):
--   update public.perfiles set rol = 'directiva' where correo = 'directiva@civora.com';
-- =====================================================================
