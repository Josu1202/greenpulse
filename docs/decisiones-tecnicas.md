# Decisiones técnicas - GreenPulse

Este documento registra las decisiones técnicas principales tomadas durante el desarrollo de GreenPulse. Su objetivo es justificar por qué se eligieron ciertas tecnologías, estructuras y límites del proyecto.

## 1. Uso de Next.js

Se decidió utilizar Next.js porque permite desarrollar una aplicación web moderna con una estructura clara de rutas, componentes y páginas.

Next.js facilita:

* Organización del frontend.
* Uso de componentes reutilizables.
* Creación de rutas mediante App Router.
* Integración con TypeScript.
* Desarrollo de una interfaz moderna y defendible técnicamente.

## 2. Uso de TypeScript

Se decidió utilizar TypeScript para mejorar la claridad y seguridad del código.

TypeScript permite definir interfaces para las entidades principales del sistema, como:

* User
* Report
* Category
* StatusLog
* Settings

Esto ayuda a reducir errores y facilita la explicación técnica del proyecto.

## 3. Uso de Tailwind CSS

Se decidió usar Tailwind CSS para construir una interfaz responsiva de forma rápida y ordenada.

Tailwind permite:

* Crear diseños adaptables.
* Mantener estilos consistentes.
* Evitar archivos CSS demasiado grandes.
* Aplicar clases directamente en los componentes.

## 4. Uso de IndexedDB como persistencia principal

Se decidió utilizar IndexedDB porque el proyecto necesita persistencia local real.

IndexedDB permite guardar datos importantes aunque el usuario recargue la página o cierre el navegador.

En GreenPulse se usará IndexedDB para almacenar:

* Usuarios.
* Reportes ambientales.
* Categorías.
* Historial de estados.
* Configuraciones.

## 5. Uso de Dexie.js

Se decidió usar Dexie.js para facilitar el manejo de IndexedDB.

IndexedDB puede ser complejo si se usa directamente. Dexie simplifica:

* Creación de tablas.
* Consultas.
* Inserciones.
* Actualizaciones.
* Eliminaciones.
* Operaciones asincrónicas.

## 6. Uso limitado de LocalStorage

Se decidió no usar LocalStorage como base de datos principal.

LocalStorage solo podrá usarse para datos pequeños, como:

* Sesión activa.
* Preferencias simples.
* Tema visual.

Los datos importantes deben guardarse en IndexedDB.

## 7. Uso de Zod para validaciones

Se decidió usar Zod para validar formularios y datos antes de guardarlos.

Zod puede utilizarse en:

* Registro.
* Login.
* Formulario de reportes.
* Validación de campos obligatorios.
* Validación de tipos de datos.

## 8. Uso de Leaflet para mapas

Se decidió usar Leaflet para mostrar reportes ambientales en un mapa.

Leaflet permite:

* Mostrar mapas interactivos.
* Agregar marcadores.
* Representar reportes por ubicación.
* Mostrar detalles al seleccionar un marcador.

## 9. Uso de Recharts para gráficas

Se decidió usar Recharts para construir gráficas del dashboard.

Recharts permite representar:

* Reportes por categoría.
* Reportes por estado.
* Tendencias de reportes.
* Indicadores visuales.

## 10. Arquitectura por carpetas

Se decidió organizar el proyecto en carpetas con responsabilidades claras:

```txt
src/
├── app/
├── components/
├── features/
├── db/
├── hooks/
├── schemas/
├── types/
├── utils/
└── store/
```

Esta organización ayuda a evitar código mezclado y facilita que cada integrante trabaje en su módulo.

## 11. Prioridad del MVP

Se decidió priorizar el MVP antes de agregar funciones avanzadas.

El MVP debe incluir:

* Autenticación local.
* CRUD de reportes.
* IndexedDB.
* Dashboard.
* Mapa ambiental.
* Responsive design.
* Documentación.

Funciones como IA, IoT, ranking o exportación se consideran extras.

## 12. Sin backend real en la fase inicial

Se decidió no implementar backend real en la fase inicial para reducir complejidad.

El proyecto se enfocará en una aplicación frontend con persistencia local mediante IndexedDB.

Esto permite cumplir con el alcance inicial sin depender de servidores externos.

## 13. Defensa técnica

Se decidió mantener una arquitectura simple y clara para que el equipo pueda defender el proyecto.

Cada módulo debe poder responder:

* Qué hace.
* Dónde está ubicado.
* Cómo se conecta con otros módulos.
* Cómo usa IndexedDB.
* Cómo se prueba.
* Qué pasa al recargar la página.

## 14. Criterio general

La decisión más importante del proyecto es mantener GreenPulse como un MVP funcional, estable y defendible.

Un MVP completo tiene más valor que muchas funciones avanzadas incompletas.
