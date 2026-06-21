# Arquitectura del proyecto GreenPulse

GreenPulse está diseñado como una aplicación frontend moderna desarrollada con Next.js y TypeScript. La arquitectura se organiza por responsabilidades para mantener el código limpio, modular, fácil de mantener y defendible técnicamente.

## Objetivo de la arquitectura

El objetivo principal de la arquitectura es separar correctamente las rutas, componentes, lógica de negocio, persistencia local, validaciones, tipos y documentación.

Esta separación permite:

* Evitar código monolítico.
* Facilitar el trabajo en equipo.
* Mejorar la integración entre módulos.
* Mantener una estructura clara.
* Facilitar la defensa técnica.
* Reducir errores por archivos mezclados.
* Mejorar el mantenimiento del proyecto.

## Capas principales

## 1. Capa de rutas

Ubicación:

```txt
src/app/
```

Esta capa contiene las páginas principales de la aplicación usando App Router de Next.js.

Ejemplos:

```txt
src/app/login/
src/app/register/
src/app/dashboard/
src/app/reports/
src/app/map/
src/app/profile/
```

Las páginas deben encargarse principalmente de mostrar vistas y conectar componentes. No deben contener toda la lógica del sistema.

## 2. Capa de componentes

Ubicación:

```txt
src/components/
```

Esta capa contiene componentes reutilizables de interfaz.

Subcarpetas sugeridas:

```txt
components/ui/
components/layout/
components/dashboard/
components/reports/
components/maps/
```

Ejemplos de componentes:

* Button
* Input
* Card
* Modal
* Navbar
* Sidebar
* ReportForm
* ReportTable
* DashboardCard
* MapView

## 3. Capa de features

Ubicación:

```txt
src/features/
```

Esta capa organiza la lógica específica de cada módulo funcional.

Módulos principales:

```txt
features/auth/
features/reports/
features/dashboard/
features/map/
features/ranking/
```

Cada feature puede contener componentes internos, servicios o funciones propias del módulo.

## 4. Capa de base de datos local

Ubicación:

```txt
src/db/
```

Esta capa contiene la configuración de Dexie e IndexedDB.

Debe incluir:

* Definición de la base de datos.
* Tablas principales.
* Repositorios.
* Seed inicial.
* Operaciones CRUD.

IndexedDB será la persistencia principal del proyecto.

## 5. Capa de hooks

Ubicación:

```txt
src/hooks/
```

Los hooks personalizados permiten reutilizar lógica entre componentes.

Ejemplos:

```txt
useAuth.ts
useReports.ts
useMapFilters.ts
```

## 6. Capa de tipos

Ubicación:

```txt
src/types/
```

Aquí se definen las interfaces principales del sistema.

Entidades sugeridas:

* User
* Report
* Category
* StatusLog
* Settings

## 7. Capa de validaciones

Ubicación:

```txt
src/schemas/
```

Aquí se colocan los esquemas de validación, preferiblemente usando Zod.

Ejemplos:

```txt
auth.schema.ts
report.schema.ts
```

## 8. Capa de utilidades

Ubicación:

```txt
src/utils/
```

Contiene funciones auxiliares reutilizables.

Ejemplos:

* Formateo de fechas.
* Constantes.
* Helpers de texto.
* Transformaciones simples de datos.

## Flujo general de datos

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

## Ejemplo aplicado: crear reporte ambiental

1. El usuario llena el formulario de reporte.
2. El formulario valida los datos.
3. El componente llama al hook de reportes.
4. El hook llama al repositorio de reportes.
5. El repositorio guarda el reporte en IndexedDB mediante Dexie.
6. La lista de reportes se actualiza.
7. El mapa muestra el nuevo marcador.
8. El dashboard recalcula sus indicadores.

## Regla principal

Las páginas no deben contener toda la lógica del sistema. La lógica debe distribuirse entre componentes, hooks, features, repositorios, tipos y validaciones.

## Beneficio para la defensa técnica

Esta arquitectura permite explicar claramente:

* Dónde están las pantallas.
* Dónde están los componentes.
* Dónde se guarda la información.
* Cómo se conecta la UI con IndexedDB.
* Cómo se actualizan el dashboard y el mapa.
* Cómo se mantiene el código organizado.
