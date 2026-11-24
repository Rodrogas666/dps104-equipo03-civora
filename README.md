# Civora — Ciudadano + mejora

Aplicación móvil para que los vecinos de una residencial reporten **baches, basura y alumbrado dañado** con foto y ubicación, y para que la directiva actualice el estado de cada reporte (**Pendiente → En proceso → Resuelto**).

Proyecto del curso **DPS104 — Diseño y Programación de Software Multiplataforma** (ciclo complementario 03-2026), Universidad Don Bosco. Docente: Karens Medrano. **Equipo 03.**

## Mapa del repositorio

| Carpeta | Contenido |
|---|---|
| [`app-movil/`](app-movil/) | App móvil (producto principal): Expo + React Native, expo-router, NativeWind y TypeScript. Ver su [README](app-movil/README.md). |
| [`prototipo-web/`](prototipo-web/) | Prototipo web del Lab Fase 1 (Next.js), ya calificado; se conserva como referencia. |
| [`nube/`](nube/) | Esquema de datos, reglas y plantilla `.env.example` del servicio en la nube (Fases 3 y 4). |
| [`docs/`](docs/) | Documentación de teoría: definición (T1), diseño (T2), datos (T3) y entrevistas anónimas. |

## Cómo ejecutar la app

Requisitos: Node.js LTS y la app **Expo Go** en el celular (Android o iOS).

```bash
cd app-movil
npm install
npx expo start
```

Escanea el código QR con Expo Go (en iOS, con la cámara). El celular y la computadora deben estar en la misma red. Pulsando `w` en la terminal también se abre la versión web.

Cada carpeta de código tiene su propio `package.json` y se instala dentro de ella. Las credenciales van en un `.env` dentro de la carpeta correspondiente; está ignorado por Git y solo se versiona `.env.example`.

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
