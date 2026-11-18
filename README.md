# Civora — Ciudadano + mejora

Aplicación móvil para que los vecinos de una residencial reporten **baches, basura y alumbrado dañado** con foto y ubicación, y para que la directiva actualice el estado de cada reporte (**Pendiente → En proceso → Resuelto**).

Proyecto del curso **DPS104 — Diseño y Programación de Software Multiplataforma** (ciclo complementario 03-2026), Universidad Don Bosco. Docente: Karens Medrano. Equipo 3.

## Tecnologías

- **App móvil:** React Native + Expo (`app-movil/`)
- **Servicio en la nube:** Firebase o Supabase (`nube/`)
- **Diseño:** Figma (ver `docs/T2_diseno/`)
- **Prototipo web (Lab Fase 1, ya calificado):** Next.js + React + TypeScript (`prototipo-web/`)

## Estructura del repositorio

| Carpeta | Contenido | Fase |
|---|---|---|
| `prototipo-web/` | Prototipo web de la práctica de laboratorio de Fase 1. Se conserva como referencia. | Lab Fase 1 |
| `app-movil/` | Proyecto Expo con `screens/` y `components/`. | Lab Fase 2 en adelante |
| `nube/` | Reglas, esquema de datos y `.env.example` del servicio en la nube. | Fases 3 y 4 |
| `docs/` | Documentación: definición (T1), diseño (T2), datos (T3) y entrevistas. | Teoría |

## Instalación

Cada carpeta de código tiene su propio `package.json`; se instala dentro de ella.

```bash
# Prototipo web
cd prototipo-web
npm install
npm run dev

# App móvil (cuando exista)
cd app-movil
npm install
npx expo start
```

Las credenciales van en un archivo `.env` dentro de la carpeta correspondiente. Está ignorado por Git; solo se versiona `.env.example`.

## Flujo de trabajo del equipo

- Una rama por integrante, con su número de carné: `MV242667`, `ES232712`, `PA242675`.
- Al terminar cada laboratorio se hace commit **"Fase N"** y se integra a `main`.
- No se hace push directo de código sin revisar a `main`; antes de empezar, `git pull origin main`.

## Integrantes

| Nombre | Carné |
|---|---|
| Carlos Eduardo Merino Ventura | MV242667 |
| Rafael Alejandro Escorcia Siliézar | ES232712 |
| Rodrigo Daniel Pineda Ardón | PA242675 |
