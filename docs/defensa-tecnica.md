# Guía de defensa técnica - GreenPulse

Este documento sirve como apoyo para la exposición y defensa técnica del proyecto GreenPulse.

La defensa debe demostrar que el equipo comprende el problema, la solución propuesta, la arquitectura del sistema, el uso de IndexedDB, el flujo de datos, el diseño responsivo y la organización del código.

## 1. Presentación general del proyecto

GreenPulse es una plataforma web de reportes y monitoreo ambiental. Su objetivo es permitir que una comunidad educativa o zona local pueda registrar incidencias ambientales, visualizarlas en un mapa y analizarlas mediante un dashboard.

El sistema busca resolver el problema de los reportes ambientales informales, los cuales muchas veces se pierden, no tienen seguimiento y no permiten identificar zonas críticas.

## 2. Problema que resuelve

En muchas comunidades, los problemas ambientales como acumulación de basura, residuos, contaminación o zonas críticas se reportan de manera informal. Esto provoca falta de seguimiento, poca información para tomar decisiones y dificultad para visualizar dónde se concentran los problemas.

GreenPulse responde a este problema mediante:

* Registro estructurado de reportes.
* Clasificación por categoría.
* Seguimiento por estado.
* Visualización en mapa.
* Análisis mediante dashboard.
* Persistencia local de datos.

## 3. Objetivo técnico

Desarrollar una aplicación web moderna con Next.js y TypeScript que permita registrar, almacenar, visualizar y analizar reportes ambientales usando IndexedDB como sistema de persistencia local.

## 4. Tecnologías utilizadas

* Next.js: framework frontend para construir la aplicación.
* TypeScript: tipado del código para reducir errores.
* Tailwind CSS: diseño visual y responsive.
* IndexedDB: almacenamiento local de datos importantes.
* Dexie.js: librería para manejar IndexedDB de forma más sencilla.
* Zod: validación de formularios y datos.
* Leaflet: visualización de mapa ambiental.
* Recharts: gráficas e indicadores del dashboard.

## 5. Arquitectura del sistema

La aplicación se organiza en varias capas:

```txt
Usuario
↓
Next.js App Router
↓
Componentes
↓
Hooks personalizados
↓
Repositorios o servicios
↓
Dexie
↓
IndexedDB
↓
Dashboard / Mapa / Reportes
```

Esta arquitectura permite separar responsabilidades y evitar que todo el código esté mezclado en una sola pantalla.

## 6. Estructura de carpetas

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

## Explicación breve

`app/` contiene las rutas y pantallas principales.

`components/` contiene piezas reutilizables de la interfaz.

`features/` contiene la lógica de cada módulo.

`db/` contiene la configuración de Dexie e IndexedDB.

`hooks/` contiene lógica reutilizable.

`schemas/` contiene validaciones.

`types/` contiene interfaces TypeScript.

`utils/` contiene funciones auxiliares.

`store/` puede contener estado global si se necesita.

## 7. Flujo principal del usuario

1. El usuario se registra o inicia sesión.
2. Entra al dashboard.
3. Crea un reporte ambiental.
4. El reporte se guarda en IndexedDB.
5. El reporte aparece en la lista de reportes.
6. El reporte aparece como marcador en el mapa.
7. El dashboard actualiza sus indicadores.
8. El usuario puede cambiar el estado del reporte.

## 8. Por qué se usó IndexedDB

Se usó IndexedDB porque permite guardar información localmente en el navegador de forma más robusta que LocalStorage.

IndexedDB permite:

* Guardar estructuras de datos más completas.
* Manejar usuarios, reportes, categorías e historial.
* Mantener datos aunque se recargue la página.
* Trabajar de forma asincrónica.
* Cumplir con el requisito de persistencia local.

LocalStorage puede usarse para datos pequeños, como una sesión activa o preferencias simples, pero no como base de datos principal.

## 9. Cómo fluye la información

Cuando el usuario crea un reporte:

1. El formulario captura los datos.
2. Se validan los campos.
3. El componente llama a un hook.
4. El hook llama al repositorio.
5. El repositorio guarda el reporte usando Dexie.
6. Dexie almacena los datos en IndexedDB.
7. La interfaz se actualiza.
8. El mapa y el dashboard reflejan el nuevo reporte.

## 10. Preguntas probables y respuestas sugeridas

## ¿Por qué eligieron Next.js?

Porque permite organizar el frontend mediante rutas, componentes y una arquitectura moderna. Además, facilita crear una aplicación web clara, escalable y fácil de defender técnicamente.

## ¿Por qué usaron TypeScript?

Porque permite definir tipos para entidades como usuarios, reportes y categorías, reduciendo errores y haciendo el código más claro.

## ¿Por qué usaron IndexedDB?

Porque permite persistencia local real. Los datos no se pierden al recargar la página y se pueden guardar estructuras más completas que en LocalStorage.

## ¿Qué pasa al recargar la página?

Los datos principales se recuperan desde IndexedDB. Por eso los reportes, el mapa y el dashboard pueden reconstruirse con la información guardada.

## ¿Cómo evitaron código desordenado?

Separamos el proyecto por carpetas: rutas, componentes, features, base de datos, hooks, tipos, validaciones y documentación.

## ¿Cómo se actualiza el dashboard?

El dashboard consulta los reportes guardados y calcula indicadores como total de reportes, reportes por categoría y reportes por estado.

## ¿Cómo se muestran los reportes en el mapa?

Cada reporte guarda latitud y longitud. El mapa lee esos datos y genera marcadores visuales para representar las incidencias ambientales.

## ¿Cómo aseguran que el sistema sea responsive?

Se usa diseño adaptable, componentes flexibles y pruebas en diferentes tamaños de pantalla: móvil, tablet y escritorio.

## ¿Qué módulos forman el MVP?

El MVP incluye autenticación local, reportes ambientales, IndexedDB, dashboard, mapa ambiental, categorías, estados, diseño responsivo y documentación.

## ¿Qué dejaron fuera del alcance inicial?

Se dejó fuera un backend real, autenticación empresarial, sensores IoT físicos, IA entrenada y predicciones avanzadas, porque el objetivo inicial es asegurar un MVP funcional.

## 11. Guion breve para exposición

Buenos días. Nuestro proyecto se llama GreenPulse, una plataforma web de reportes y monitoreo ambiental.

El problema que identificamos es que muchas incidencias ambientales se reportan de forma informal, por lo que no existe seguimiento claro ni información organizada para tomar decisiones.

Nuestra solución permite registrar reportes ambientales con categoría, descripción, ubicación, imagen y estado. Estos datos se almacenan localmente mediante IndexedDB y luego se visualizan en un dashboard y en un mapa ambiental.

Técnicamente, el proyecto está desarrollado con Next.js, TypeScript, Tailwind CSS, IndexedDB y Dexie. La arquitectura está organizada por rutas, componentes, features, hooks, tipos, validaciones y base de datos local.

El flujo principal inicia cuando el usuario se registra, crea un reporte, el sistema lo guarda en IndexedDB, lo muestra en el mapa y actualiza los indicadores del dashboard.

Priorizamos un MVP funcional, estable y defendible antes de agregar funciones avanzadas como IA o IoT.

## 12. Cierre técnico

GreenPulse demuestra el uso de tecnologías modernas del frontend, persistencia local real, organización modular, diseño responsivo y visualización de datos. La solución está pensada para ser funcional, comprensible y técnicamente defendible.
