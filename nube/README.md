# Servicio en la nube (Supabase)

Civora usa **Supabase** para la base de datos (PostgreSQL), la autenticación y el almacenamiento de fotos. El esquema completo está en [`schema.sql`](schema.sql).

| Tabla / recurso | Para qué sirve |
|---|---|
| `perfiles` | Un perfil por usuario (`id` = `auth.users.id`): nombre, **rol** (`vecino` o `directiva`), residencial, pasaje y polígono |
| `reportes` | Reportes de los vecinos: categoría, estado, ubicación, foto, nota de la directiva |
| `historial_estados` | Cada cambio de estado de un reporte (lo llenan disparadores, la app no escribe aquí) |
| Bucket `fotos-reportes` | Fotos de los reportes (público para leer; cada usuario sube solo en su carpeta `<id_usuario>/`) |

Seguridad (RLS): cualquier usuario con sesión ve los reportes; solo el autor crea reportes (siempre en `pendiente`); solo la directiva cambia el estado. **El rol vive en `perfiles`, no en el correo.**

## 1. Crear el proyecto

1. Entra a <https://supabase.com>, crea una cuenta y un proyecto nuevo (elige una región cercana y guarda la contraseña de la base).
2. Espera a que el proyecto termine de crearse.

## 2. Crear las tablas

1. En el panel: **SQL Editor > New query**.
2. Pega todo el contenido de [`schema.sql`](schema.sql) y pulsa **Run**. Se puede ejecutar más de una vez sin romper nada.

## 3. Desactivar la confirmación de correo (para pruebas)

**Authentication > Sign In / Providers > Email** y desactiva **Confirm email**. Guarda.

Si queda activada, al crear una cuenta la app muestra *"Te enviamos un correo para confirmar tu cuenta…"* y no se puede entrar hasta confirmarla.

## 4. Conectar la app

1. En **Project Settings > API** (o **Data API** / **API Keys**) copia la **Project URL** y la clave **anon public**.
2. En `app-movil/`, copia `.env.example` como `.env` y llénalo:

   ```env
   EXPO_PUBLIC_USAR_NUBE=true
   EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
   ```

3. Reinicia Expo limpiando la caché para que lea las variables nuevas: `npx expo start -c`.

`.env` está en `.gitignore`: **nunca** lo subas ni pegues las claves en el código. Usa solo la clave *anon*; la *service_role* nunca va en la app.

## 5. Crear la cuenta de la directiva

1. Desde la app, crea la cuenta normal (por ejemplo `directiva@civora.com`). Entra como vecino.
2. En **SQL Editor** ejecuta una sola vez:

   ```sql
   update public.perfiles set rol = 'directiva' where correo = 'directiva@civora.com';
   ```

3. Cierra sesión en la app y vuelve a entrar: ya verás el panel de la directiva en el detalle de cada reporte.

## Volver al modo en memoria

Pon `EXPO_PUBLIC_USAR_NUBE=false` en `app-movil/.env` (o borra el archivo) y reinicia con `npx expo start -c`. La app vuelve a usar los datos de ejemplo y el rol se deduce del correo (los que empiezan con `directiva` entran como directiva).

## Problemas comunes

| Mensaje en la app | Qué revisar |
|---|---|
| "Sin conexión. Revisa tu Internet…" | Internet del teléfono, o `EXPO_PUBLIC_SUPABASE_URL` mal escrita |
| "No tienes permiso para hacer esto." | La sesión venció o el usuario no es directiva en `perfiles` |
| "Correo o contraseña incorrectos." | Datos de acceso, o la cuenta no existe |
| "Te enviamos un correo para confirmar…" | **Confirm email** sigue activado (paso 3) |
| La app se cierra al abrir con un error sobre `EXPO_PUBLIC_SUPABASE_URL` | `USAR_NUBE=true` pero faltan la URL o la clave en `.env` |
