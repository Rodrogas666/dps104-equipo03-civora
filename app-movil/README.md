# Civora — App móvil

App de Civora hecha con **Expo (React Native)**, **expo-router**, **NativeWind** (Tailwind para React Native) y **TypeScript**.

Pantallas: acceso (inicio de sesión y registro), inicio, nuevo reporte (cámara y ubicación), Mis reportes, detalle del reporte (con panel de directiva) y perfil.

## Cómo ejecutar

```bash
cd app-movil
npm install
npx expo start
```

Escanea el QR con **Expo Go**. Pulsa `w` para abrir la versión web.

Para revisar tipos: `npx tsc --noEmit`.

## Variables de entorno

Copia `.env.example` como `.env` (está en `.gitignore`, nunca se sube):

| Variable | Valor | Para qué |
|---|---|---|
| `EXPO_PUBLIC_USAR_NUBE` | `true` o `false` | `true` usa Supabase. Si falta o es `false`, la app usa los datos en memoria |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://TU-PROYECTO.supabase.co` | URL del proyecto (solo con la nube) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | clave *anon public* | Clave pública del proyecto (solo con la nube) |

Después de cambiar `.env`, reinicia con `npx expo start -c`. Cómo crear el proyecto de Supabase: [`../nube/README.md`](../nube/README.md).

## Usuarios de prueba

**Modo nube** (`EXPO_PUBLIC_USAR_NUBE=true`): las cuentas son reales (Supabase Auth). Crea una desde *Crear cuenta*; el **rol sale de la tabla `perfiles`** y la directiva se asigna a mano (ver `nube/README.md`).

**Modo en memoria** (sin `.env` o `EXPO_PUBLIC_USAR_NUBE=false`): cualquier correo y contraseña sirven para entrar, y **el rol se deduce del correo** (`rolDesdeCorreo` en `src/context/SesionContext.tsx`).

| Correo | Rol | Qué puede hacer |
|---|---|---|
| `vecino@correo.com` (o cualquier correo que no empiece con "directiva") | Vecino | Crear reportes y consultar los suyos |
| Cualquier correo que empiece con `directiva`, por ejemplo `directiva@civora.com` | Directiva | Además, cambiar el estado de un reporte desde su detalle |

En modo en memoria los reportes se reinician al recargar la app.

## Datos (`src/services` y `src/lib`)

Las pantallas solo usan `src/services/reportesService.ts`, que delega según `EXPO_PUBLIC_USAR_NUBE`:

| Archivo | Qué hace |
|---|---|
| `lib/supabase.ts` | Cliente de Supabase y el interruptor `USAR_NUBE` (el cliente es `null` en modo en memoria) |
| `services/reportesService.ts` | Fachada: `listarReportes`, `obtenerReporte`, `crearReporte`, `actualizarEstado`, `buscarPosibleDuplicado`, `extraerPasaje` |
| `services/reportesMemoria.ts` | Implementación con datos de ejemplo |
| `services/reportesNube.ts` | Implementación con Supabase (incluye `subirFoto`) |
| `services/autenticacionNube.ts` | Inicio de sesión, registro, perfil y cierre de sesión con Supabase |
| `services/errores.ts` | Traduce errores de red y del servidor a mensajes en español |
| `services/formatoReportes.ts` | Formato de fecha, título y foto por defecto (compartido) |

## Rutas (`src/app`)

expo-router crea una ruta por archivo. No se renombran ni mueven sin cambiar la navegación.

| Ruta | Archivo | Pantalla |
|---|---|---|
| `/` | `index.tsx` | Acceso: inicio de sesión y registro |
| `/inicio` | `(tabs)/inicio.tsx` | Pestaña Inicio: reportes de la residencial con filtros |
| `/reportar` | `(tabs)/reportar.tsx` | Pestaña Reportar: no tiene pantalla propia; al tocarla abre `/nuevo-reporte` |
| `/mis-reportes` | `(tabs)/mis-reportes.tsx` | Pestaña Mis reportes: resumen, filtros y lista propia |
| `/nuevo-reporte` | `nuevo-reporte.tsx` | Formulario de nuevo reporte (con aviso de posible duplicado) |
| `/tomar-foto` | `tomar-foto.tsx` | Cámara para la foto del reporte |
| `/ubicacion-reporte` | `ubicacion-reporte.tsx` | Elegir la ubicación del problema |
| `/reporte-enviado` | `reporte-enviado.tsx` | Confirmación de reporte enviado |
| `/reporte/[id]` | `reporte/[id].tsx` | Detalle y seguimiento; la directiva cambia el estado aquí |
| `/perfil` | `perfil.tsx` | Perfil del usuario y cerrar sesión (se abre desde Inicio) |

`_layout.tsx` define la pila raíz y los proveedores de sesión y reportes. `(tabs)/_layout.tsx` define la barra de pestañas.

## Estructura de `src/`

```
src/
├── app/         Rutas de expo-router (una pantalla por archivo)
├── components/  Componentes de interfaz, agrupados por tema
│   ├── autenticacion/  Encabezado y formularios de acceso y registro
│   ├── camara/         Cámara, controles y marco de encuadre
│   ├── perfil/         Pantalla de perfil
│   ├── reportes/       EtiquetaEstadoReporte (compartida por las tres subcarpetas)
│   │   ├── lista/      Inicio y Mis reportes: tarjetas, listas, filtros y resumen
│   │   ├── nuevo/      Flujo de nuevo reporte: selectores, mapa, duplicado y confirmación
│   │   └── detalle/    Detalle del reporte y panel de la directiva
│   └── ui/             Piezas reutilizables (botón, campo de texto, pestañas)
├── screens/     Pantallas compuestas (acceso de usuario)
├── context/     Estado global: sesión (SesionContext) y reportes (ReportesContext)
├── lib/         Cliente de Supabase e interruptor USAR_NUBE
├── services/    Acceso a datos (reportesService → memoria o nube), errores y borradores de foto y ubicación
├── constants/   Colores de Civora y reportes de ejemplo
├── types/       Tipos de TypeScript (reportes, autenticación)
├── hooks/       Hooks propios (vacía por ahora)
└── utils/       Funciones auxiliares (vacía por ahora)
```

Los archivos `Nombre.web.tsx` son la versión web de `Nombre.tsx`: Metro elige uno u otro según la plataforma, por eso siempre van juntos en la misma carpeta.

Los imports usan el alias `@/` → `src/` (por ejemplo `@/components/ui/BotonPrincipal`).
