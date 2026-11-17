# Prototipo Web — Sistema de Reportes del Campus

Prototipo web desarrollado en **React / Next.js** con **TypeScript** para el registro y visualización de reportes de incidencias e infraestructura dentro del campus universitario (baches, iluminación, limpieza y mantenimiento).

## Integrantes — Equipo 3 (DPS104)
- **Carlos Merino**
- **Rodrigo Pineda**
- **Rafael Escorcia**

## Estructura del Prototipo (`prototipo-web`)
- `src/components/TarjetaReporte.tsx`: Componente de tarjeta de formulario para crear un nuevo reporte recibiendo datos y categorías mediante `props` tipadas.
- `src/components/ListaReportes.tsx`: Componente contenedor con arreglo tipado que renderiza el reporte mediante `.map()`.
- `src/components/ReporteCard.tsx`: Componente de tarjeta para visualizar reportes registrados y su estado condicional.
- `src/types/Reporte.ts`: Definición de tipos e interfaces del reporte.

## Ejecución
```bash
cd prototipo-web
npm install
npm run dev
```
