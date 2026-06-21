# GreenPulse

GreenPulse es una plataforma web de reportes y monitoreo ambiental orientada a registrar, visualizar y analizar incidencias ambientales dentro de una comunidad educativa o zona local.

El sistema permite crear reportes ambientales con categoría, descripción, ubicación, imagen y estado. La información se almacena localmente mediante IndexedDB y se visualiza en un dashboard y un mapa ambiental interactivo.

## Objetivo del proyecto

Desarrollar una aplicación web moderna, funcional, responsiva y defendible técnicamente, que permita gestionar reportes ambientales mediante tecnologías web modernas, persistencia local y visualización de datos.

## Funcionalidades principales del MVP

* Registro e inicio de sesión local.
* CRUD de reportes ambientales.
* Persistencia local mediante IndexedDB.
* Gestión de categorías ambientales.
* Gestión de estados de reportes.
* Dashboard con indicadores principales.
* Mapa ambiental con reportes geolocalizados.
* Diseño responsivo para escritorio, tablet y móvil.
* Documentación técnica y manual de uso.

## Tecnologías utilizadas

* Next.js
* TypeScript
* Tailwind CSS
* IndexedDB
* Dexie.js
* Zod
* Leaflet
* Recharts

## Estructura del proyecto

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

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta del proyecto:

```bash
cd greenpulse
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:3000
```

## Flujo principal del sistema

1. El usuario se registra o inicia sesión.
2. Accede al dashboard.
3. Crea un reporte ambiental.
4. El reporte se guarda en IndexedDB.
5. El reporte aparece en el mapa.
6. El dashboard actualiza sus indicadores.
7. El usuario puede editar el estado del reporte.

## Estrategia de ramas

* `main`: contiene la versión estable y lista para presentar.
* `develop`: integra los avances del equipo.
* `feature/*`: ramas individuales por funcionalidad.

Ejemplos de ramas:

```txt
feature/auth
feature/ui-layout
feature/indexeddb
feature/reports
feature/dashboard
feature/map
feature/docs
feature/qa
```

## Convención de commits

Se recomienda usar commits claros:

```txt
feat: add report form
feat: configure indexeddb with dexie
fix: correct map marker filter
docs: update architecture document
style: improve responsive layout
refactor: separate reports logic into hook
chore: create project structure
```

## Definition of Done

Una funcionalidad se considera terminada cuando:

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

La prioridad principal es completar el MVP crítico antes de agregar funciones avanzadas.

El MVP debe asegurar:

* Autenticación local.
* Reportes ambientales.
* Persistencia con IndexedDB.
* Mapa ambiental.
* Dashboard.
* Responsive design.
* Documentación técnica.

Funciones como IA, IoT, predicciones o ranking avanzado solo deben agregarse cuando el MVP esté estable.
