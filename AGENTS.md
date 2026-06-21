# AGENTS.md

## GreenPulse - Instrucciones generales para asistentes de IA

Este archivo define las reglas que deben seguir los asistentes de IA que colaboren en el desarrollo del proyecto **GreenPulse**.

GreenPulse es una plataforma web de reportes y monitoreo ambiental. Su MVP permite registrar incidencias ambientales, almacenarlas localmente con IndexedDB, visualizarlas en un mapa y analizarlas mediante un dashboard.

## Tecnologías principales

* Next.js
* TypeScript
* Tailwind CSS
* IndexedDB
* Dexie.js
* Zod
* Leaflet
* Recharts

## Objetivo del proyecto

Desarrollar una aplicación web moderna, funcional, responsiva y defendible técnicamente, priorizando el MVP antes que funciones avanzadas.

El sistema debe permitir:

* Registro e inicio de sesión local.
* CRUD de reportes ambientales.
* Persistencia local usando IndexedDB.
* Visualización de reportes en mapa.
* Dashboard con indicadores.
* Categorías y estados de reportes.
* Interfaz responsiva.
* Documentación clara para defensa técnica.

## Organización general del proyecto

El desarrollo de GreenPulse debe mantenerse organizado, modular y defendible técnicamente. Todo el equipo debe respetar la estructura definida para evitar código mezclado, duplicación de lógica y problemas de integración.

Las responsabilidades generales del proyecto incluyen:

* Mantener una arquitectura clara.
* Respetar la estructura de carpetas.
* Documentar cambios importantes.
* Usar GitHub de forma ordenada.
* Trabajar mediante ramas por funcionalidad.
* Aplicar checklist de calidad antes de integrar cambios.
* Mantener el MVP como prioridad.
* Asegurar que cada módulo pueda explicarse técnicamente.
* Evitar funciones avanzadas si el MVP aún no está completo.
* Mantener el código limpio, modular y fácil de revisar.

La organización del proyecto no depende de una sola persona. Cada integrante debe trabajar su módulo respetando las reglas comunes de arquitectura, nombres, commits, documentación y calidad.


## Estructura esperada del proyecto

```txt
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── reports/
│   └── maps/
├── features/
│   ├── auth/
│   ├── reports/
│   ├── dashboard/
│   ├── map/
│   └── ranking/
├── db/
│   └── repositories/
├── hooks/
├── schemas/
├── types/
├── utils/
└── store/

docs/
├── arquitectura.md
├── flujo-datos.md
├── instalacion.md
├── qa-checklist.md
├── defensa-tecnica.md
└── decisiones-tecnicas.md
```

## Reglas de arquitectura

1. Las rutas principales deben ir en `src/app/`.
2. Los componentes reutilizables deben ir en `src/components/`.
3. La lógica por módulo debe ir en `src/features/`.
4. La configuración de IndexedDB y Dexie debe ir en `src/db/`.
5. Los hooks personalizados deben ir en `src/hooks/`.
6. Las interfaces TypeScript deben ir en `src/types/`.
7. Las validaciones deben ir en `src/schemas/`.
8. Las funciones auxiliares deben ir en `src/utils/`.
9. La documentación debe ir en `docs/`.
10. No colocar lógica pesada directamente en las páginas.

## Reglas de desarrollo

* Usar TypeScript de forma clara.
* Evitar código duplicado.
* Crear componentes pequeños y reutilizables.
* Separar lógica visual, lógica de datos y lógica de validación.
* No usar LocalStorage como base de datos principal.
* Usar IndexedDB para usuarios, reportes, categorías, estados e historial.
* LocalStorage solo puede usarse para sesión activa o preferencias pequeñas.
* Mantener nombres de archivos y carpetas consistentes.
* No dejar errores en consola.
* No romper el diseño responsive.
* Toda funcionalidad importante debe poder explicarse en defensa.

## Convenciones de nombres

### Componentes

Usar PascalCase:

```txt
ReportForm.tsx
ReportTable.tsx
DashboardCard.tsx
MapView.tsx
```

### Hooks

Usar camelCase iniciando con `use`:

```txt
useAuth.ts
useReports.ts
useMapFilters.ts
```

### Tipos

Usar nombres claros:

```txt
user.ts
report.ts
category.ts
status.ts
```

### Repositorios

Usar el formato:

```txt
report.repository.ts
user.repository.ts
category.repository.ts
```

## Flujo de datos esperado

```txt
Usuario
↓
Página de Next.js
↓
Componente
↓
Hook personalizado
↓
Repositorio o servicio
↓
Dexie
↓
IndexedDB
↓
Actualización de la interfaz
```

## Reglas para IndexedDB

La base de datos local debe manejarse con Dexie.

Entidades principales:

* User
* Report
* Category
* StatusLog
* Settings

Los reportes deben persistir aunque el usuario recargue la página.

No se debe simular persistencia únicamente con variables de estado.

## Estrategia de GitHub

Ramas principales:

```txt
main
develop
feature/auth
feature/ui-layout
feature/indexeddb
feature/reports
feature/dashboard
feature/map
feature/docs
feature/qa
```

Uso de ramas:

* `main`: versión estable y lista para presentar.
* `develop`: integración general del equipo.
* `feature/*`: ramas de trabajo por funcionalidad.

## Convención de commits

Usar commits claros:

```txt
feat: add report form
feat: configure indexeddb with dexie
fix: correct dashboard counter
docs: update architecture document
style: improve responsive layout
refactor: separate reports logic into hook
chore: create project structure
```

Tipos permitidos:

* `feat`: nueva funcionalidad.
* `fix`: corrección.
* `docs`: documentación.
* `style`: cambios visuales.
* `refactor`: mejora interna.
* `test`: pruebas.
* `chore`: configuración o mantenimiento.

## Definition of Done

Una funcionalidad se considera terminada solo si:

* Funciona correctamente.
* No genera errores en consola.
* Tiene validaciones mínimas.
* Responde en móvil.
* Usa TypeScript correctamente.
* Persiste datos si corresponde.
* No rompe otros módulos.
* Puede explicarse técnicamente.
* Está documentada si afecta arquitectura, instalación o uso.

## Prioridad del proyecto

La prioridad absoluta es terminar la Fase 1 o MVP crítico.

No agregar funciones avanzadas como IA, IoT o predicciones si el MVP aún no está completo.

El MVP debe incluir:

* Auth local.
* Reportes ambientales.
* IndexedDB.
* Mapa ambiental.
* Dashboard.
* Categorías y estados.
* Responsive design.
* Documentación.

## Reglas para asistentes de IA

Cuando un asistente de IA genere código para este proyecto, debe:

1. Respetar la estructura definida.
2. Explicar brevemente dónde va cada archivo.
3. Evitar soluciones demasiado complejas.
4. Mantener el enfoque en el MVP.
5. Usar nombres claros.
6. No inventar librerías innecesarias.
7. Evitar código monolítico.
8. Separar componentes, hooks, tipos y repositorios.
9. Dar instrucciones paso a paso cuando se pidan.
10. Mantener el proyecto defendible técnicamente.

## Enfoque para defensa técnica

Toda solución debe poder responder:

* ¿Qué hace esta parte?
* ¿Dónde está ubicada?
* ¿Por qué se organizó así?
* ¿Cómo se conecta con IndexedDB?
* ¿Cómo afecta al dashboard o mapa?
* ¿Cómo se prueba?
* ¿Qué pasa si se recarga la página?

## Nota final

GreenPulse debe mantenerse simple, funcional y bien organizado.
Un MVP completo, estable y defendible vale más que muchas funciones avanzadas incompletas.
