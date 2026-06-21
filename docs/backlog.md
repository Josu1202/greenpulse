# Backlog del proyecto - GreenPulse

Este documento resume las tareas principales del proyecto GreenPulse. Su objetivo es mantener una organización simple y clara para que el equipo sepa qué debe desarrollarse, quién lo trabajará y cuál es su estado.

## Prioridades

* **Alta:** necesaria para el MVP y la defensa.
* **Media:** importante, pero puede realizarse después del MVP.
* **Baja:** extra o mejora opcional.

## Estados

* **Pendiente:** aún no se ha iniciado.
* **En proceso:** actualmente se está trabajando.
* **En revisión:** ya fue desarrollado y debe probarse.
* **Finalizado:** ya funciona correctamente y está integrado.

## Backlog principal

| Nº | Tarea                                | Responsable sugerido  | Prioridad | Estado     | Rama sugerida         |
| -: | ------------------------------------ | --------------------- | --------- | ---------- | --------------------- |
|  1 | Crear estructura base del proyecto   | Persona 4 / Equipo    | Alta      | Finalizado | main / develop        |
|  2 | Crear README inicial                 | Persona 4             | Alta      | Finalizado | feature/docs          |
|  3 | Documentar arquitectura del proyecto | Persona 4             | Alta      | Finalizado | feature/docs          |
|  4 | Documentar flujo de datos            | Persona 4             | Alta      | Finalizado | feature/docs          |
|  5 | Crear guía de instalación            | Persona 4             | Alta      | Finalizado | feature/docs          |
|  6 | Crear checklist de QA                | Persona 4             | Alta      | Finalizado | feature/docs          |
|  7 | Crear guía de defensa técnica        | Persona 4             | Alta      | Finalizado | feature/docs          |
|  8 | Crear layout base y navegación       | Persona 1             | Alta      | Pendiente  | feature/ui-layout     |
|  9 | Crear componentes UI reutilizables   | Persona 1             | Alta      | Pendiente  | feature/ui-components |
| 10 | Configurar IndexedDB con Dexie       | Persona 2             | Alta      | Pendiente  | feature/indexeddb     |
| 11 | Crear tipos principales del sistema  | Persona 2             | Alta      | Pendiente  | feature/types         |
| 12 | Crear autenticación local            | Persona 1 / Persona 2 | Alta      | Pendiente  | feature/auth          |
| 13 | Crear CRUD de reportes ambientales   | Persona 2 / Persona 3 | Alta      | Pendiente  | feature/reports       |
| 14 | Crear dashboard conectado a reportes | Persona 3             | Alta      | Pendiente  | feature/dashboard     |
| 15 | Crear mapa ambiental con marcadores  | Persona 1 / Persona 3 | Alta      | Pendiente  | feature/map           |
| 16 | Crear validaciones con Zod           | Persona 2             | Media     | Pendiente  | feature/validations   |
| 17 | Crear filtros por categoría y estado | Persona 2 / Persona 3 | Media     | Pendiente  | feature/filters       |
| 18 | Probar responsive design             | Persona 1 / Persona 4 | Alta      | Pendiente  | feature/qa            |
| 19 | Realizar pruebas finales del MVP     | Persona 4 / Equipo    | Alta      | Pendiente  | feature/qa            |
| 20 | Preparar ensayo de defensa           | Todo el equipo        | Alta      | Pendiente  | docs/defense          |
| 21 | Crear ranking o logros ambientales   | Persona 3             | Media     | Opcional   | feature/ranking       |
| 22 | Crear exportación CSV o JSON         | Persona 3             | Media     | Opcional   | feature/export        |
| 23 | Evaluar IA o IoT simulado            | Equipo                | Baja      | Opcional   | feature/extra         |

## MVP obligatorio

El MVP se considera completo cuando el usuario puede:

1. Registrarse o iniciar sesión.
2. Crear un reporte ambiental.
3. Guardar el reporte en IndexedDB.
4. Ver los reportes en una lista.
5. Visualizar los reportes en el mapa.
6. Consultar indicadores en el dashboard.
7. Recargar la página sin perder datos.
8. Usar la aplicación en móvil, tablet y escritorio.

## Funciones opcionales

Estas funciones solo deben trabajarse si el MVP ya está estable:

* Ranking de usuarios.
* Logros ambientales.
* Exportación de reportes.
* IA simulada.
* IoT simulado.
* Predicciones básicas.

## Nota de organización

Para este proyecto universitario no es obligatorio crear un issue por cada tarea. Este backlog puede funcionar como guía principal del equipo. Si el equipo decide usar GitHub Issues, puede convertir únicamente las tareas más importantes en issues.
