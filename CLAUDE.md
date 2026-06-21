# CLAUDE.md

## GreenPulse - Instrucciones para Claude Code

Este archivo contiene instrucciones específicas para trabajar con Claude Code dentro del proyecto **GreenPulse**.

Claude debe ayudar a desarrollar, organizar, revisar y documentar el proyecto respetando la arquitectura definida por la Persona 4.

## Contexto del proyecto

GreenPulse es una aplicación web de reportes y monitoreo ambiental.

El usuario puede:

1. Registrarse o iniciar sesión.
2. Crear reportes ambientales.
3. Guardar reportes en IndexedDB.
4. Visualizar reportes en un mapa.
5. Consultar estadísticas en un dashboard.
6. Cambiar el estado de los reportes.
7. Mantener los datos aunque recargue la página.

## Stack técnico

* Next.js con App Router.
* TypeScript.
* Tailwind CSS.
* IndexedDB mediante Dexie.js.
* Validaciones con Zod.
* Mapas con Leaflet.
* Gráficas con Recharts.

## Prioridad principal

La prioridad es construir un MVP funcional y defendible.

No agregar funcionalidades avanzadas si todavía no están completas estas partes:

* Autenticación local.
* CRUD de reportes.
* Persistencia con IndexedDB.
* Dashboard conectado a datos reales.
* Mapa conectado a reportes.
* Responsive design.
* Documentación técnica.

## Rol de Claude

Claude debe actuar como asistente técnico del proyecto GreenPulse, apoyando al equipo en el desarrollo, organización, revisión y documentación del sistema.

Claude puede apoyar en:

* Estructura del proyecto.
* Revisión de arquitectura.
* Creación y mejora de documentación.
* Revisión de calidad del código.
* Generación de checklists.
* Organización de ramas y commits.
* Preparación de defensa técnica.
* Refactorización de código desordenado.
* Separación correcta entre componentes, hooks, tipos, validaciones y persistencia.
* Explicación técnica de módulos para que puedan defenderse correctamente.

Claude no debe asumir que una sola persona controla toda la arquitectura. Debe trabajar bajo las reglas generales del proyecto y ayudar a que cualquier integrante mantenga el código ordenado, funcional y defendible.


## Reglas obligatorias

Claude debe:

* Mantener la estructura del proyecto.
* No mover archivos sin explicar por qué.
* No crear carpetas nuevas innecesarias.
* No duplicar lógica.
* No colocar lógica pesada en `page.tsx`.
* No usar LocalStorage como persistencia principal.
* No reemplazar IndexedDB por una solución más simple.
* No agregar backend externo para el MVP.
* No agregar IA real si el MVP no está terminado.
* No generar código sin indicar en qué archivo debe ir.
* No borrar documentación existente sin justificarlo.

## Estructura del proyecto

```txt
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── reports/
│   ├── map/
│   └── profile/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── reports/
│   └── maps/
│
├── features/
│   ├── auth/
│   ├── reports/
│   ├── dashboard/
│   ├── map/
│   └── ranking/
│
├── db/
│   ├── database.ts
│   ├── seed.ts
│   └── repositories/
│
├── hooks/
├── schemas/
├── types/
├── utils/
└── store/

docs/
```

## Responsabilidad de cada carpeta

### `src/app/`

Contiene rutas y pantallas principales de Next.js.

No debe contener toda la lógica del negocio.

### `src/components/`

Contiene componentes reutilizables.

Ejemplos:

* Botones.
* Inputs.
* Cards.
* Tablas.
* Modales.
* Navbar.
* Sidebar.

### `src/features/`

Contiene lógica específica de cada módulo.

Ejemplos:

* Auth.
* Reports.
* Dashboard.
* Map.
* Ranking.

### `src/db/`

Contiene configuración de Dexie e IndexedDB.

Aquí deben estar:

* Tablas.
* Seed inicial.
* Repositorios.
* Operaciones CRUD.

### `src/hooks/`

Contiene hooks personalizados.

Ejemplos:

* `useAuth`
* `useReports`
* `useMapFilters`

### `src/types/`

Contiene interfaces TypeScript.

### `src/schemas/`

Contiene validaciones con Zod.

### `docs/`

Contiene documentación técnica y de defensa.

## Entidades principales

### User

Representa usuarios locales.

Campos sugeridos:

```ts
id: string;
name: string;
email: string;
passwordHash?: string;
demoPassword?: string;
role: "student" | "admin";
createdAt: string;
```

### Report

Representa un reporte ambiental.

Campos sugeridos:

```ts
id: string;
userId: string;
title: string;
description: string;
categoryId: string;
status: "pending" | "in_review" | "resolved";
priority: "low" | "medium" | "high";
latitude: number;
longitude: number;
image?: string;
createdAt: string;
updatedAt: string;
```

### Category

Representa una categoría ambiental.

Campos sugeridos:

```ts
id: string;
name: string;
color: string;
description: string;
impactFactor: number;
```

### StatusLog

Representa historial de cambios de estado.

Campos sugeridos:

```ts
id: string;
reportId: string;
previousStatus: string;
newStatus: string;
changedAt: string;
```

### Settings

Representa configuración básica de la aplicación.

Campos sugeridos:

```ts
id: string;
theme: "light" | "dark";
defaultMapCenter: {
  lat: number;
  lng: number;
};
seedLoaded: boolean;
```

## Flujo técnico esperado

Cuando el usuario crea un reporte:

```txt
ReportForm
↓
useReports
↓
report.repository.ts
↓
Dexie database.ts
↓
IndexedDB
↓
ReportList / Dashboard / MapView
```

Claude debe mantener este flujo y evitar que los componentes accedan de forma desordenada a la base de datos.

## Comandos útiles

Instalar dependencias:

```bash
npm install
```

Ejecutar proyecto:

```bash
npm run dev
```

Compilar:

```bash
npm run build
```

Ejecutar lint:

```bash
npm run lint
```

## Reglas para generar código

Cuando Claude genere código, debe entregar:

1. Nombre exacto del archivo.
2. Ruta exacta.
3. Código completo si el archivo es nuevo.
4. Fragmento claro si solo se modifica una parte.
5. Explicación breve de qué hace.
6. Indicaciones de prueba.

Ejemplo de formato esperado:

```txt
Archivo: src/types/report.ts
Acción: crear archivo
```

Después debe mostrar el código.

## Estilo de código

* Usar TypeScript claro.
* Evitar `any` salvo que sea estrictamente necesario.
* Usar interfaces para entidades principales.
* Usar nombres descriptivos.
* Preferir funciones pequeñas.
* Evitar componentes demasiado grandes.
* Mantener lógica de datos fuera de componentes visuales.
* Validar datos antes de guardarlos.

## Reglas para documentación

Claude debe mantener actualizados estos archivos:

```txt
docs/arquitectura.md
docs/flujo-datos.md
docs/instalacion.md
docs/qa-checklist.md
docs/defensa-tecnica.md
docs/decisiones-tecnicas.md
README.md
```

Cuando se agregue una funcionalidad importante, Claude debe sugerir actualizar la documentación correspondiente.

## Checklist antes de considerar una tarea terminada

* [ ] El código compila.
* [ ] No hay errores en consola.
* [ ] No hay errores de TypeScript.
* [ ] La funcionalidad se prueba manualmente.
* [ ] La interfaz responde en móvil.
* [ ] Los datos persisten si corresponde.
* [ ] No se duplicó lógica.
* [ ] Se respetó la estructura del proyecto.
* [ ] Se puede explicar en defensa.
* [ ] Se actualizó documentación si aplica.

## Preguntas de defensa que el código debe poder responder

* ¿Por qué se usó esta carpeta?
* ¿Qué hace este componente?
* ¿Qué hace este hook?
* ¿Dónde se guardan los datos?
* ¿Cómo se conecta con IndexedDB?
* ¿Qué pasa si se recarga la página?
* ¿Cómo se actualiza el dashboard?
* ¿Cómo se actualiza el mapa?
* ¿Cómo se valida el formulario?
* ¿Cómo se prueba la funcionalidad?

## Decisión técnica importante

El proyecto debe mantenerse como una aplicación frontend con persistencia local.

No se debe proponer backend real, base de datos externa o autenticación empresarial durante el MVP, porque eso aumenta la complejidad y puede afectar la entrega principal.

## Cierre

Claude debe priorizar orden, claridad, mantenibilidad y defensa técnica.

El objetivo no es crear el sistema más complejo, sino un MVP completo, funcional, estable y bien explicado.

