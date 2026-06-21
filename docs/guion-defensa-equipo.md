# Guion de defensa del equipo - GreenPulse

## 1. Objetivo del documento

Este documento sirve como guía para preparar la exposición y defensa técnica del proyecto GreenPulse. Su propósito es organizar qué debe decir cada integrante, cómo presentar el sistema, cómo explicar la arquitectura y cómo responder preguntas técnicas durante la defensa.

La defensa no debe basarse únicamente en memorizar texto. Cada integrante debe comprender su módulo, su relación con el sistema completo y el flujo general de datos.

---

# 2. Orden sugerido de exposición

El orden recomendado para presentar GreenPulse es:

1. Presentación general del proyecto.
2. Problema identificado.
3. Objetivo de GreenPulse.
4. Flujo principal del usuario.
5. Arquitectura general.
6. Explicación por módulos.
7. Demostración funcional.
8. Explicación técnica de persistencia.
9. Pruebas y control de calidad.
10. Cierre y posibles mejoras.

---

# 3. Guion general de apertura

Buenos días. Nuestro proyecto se llama **GreenPulse**, una plataforma web de reportes y monitoreo ambiental.

La idea principal del sistema es permitir que una comunidad educativa o zona local pueda registrar incidencias ambientales, visualizarlas en un mapa y analizar la información mediante un dashboard.

El problema que identificamos es que muchas veces los reportes ambientales se realizan de manera informal. Por ejemplo, una persona puede avisar verbalmente sobre acumulación de basura, contaminación o daños en zonas verdes, pero esa información puede perderse o no tener seguimiento.

GreenPulse busca organizar esa información mediante reportes estructurados, categorías, estados, ubicación geográfica y persistencia local usando IndexedDB.

---

# 4. Problema identificado

En muchas instituciones o comunidades, los problemas ambientales no se registran de forma ordenada. Esto provoca tres dificultades principales:

1. La información se pierde o queda dispersa.
2. No existe seguimiento claro del estado de cada incidencia.
3. Es difícil identificar zonas con mayor concentración de problemas.

GreenPulse responde a esta necesidad mediante una aplicación web donde los usuarios pueden crear reportes ambientales, guardarlos localmente, visualizarlos en un mapa y consultar indicadores generales.

---

# 5. Objetivo del proyecto

El objetivo de GreenPulse es desarrollar una plataforma web moderna, funcional y defendible técnicamente, que permita registrar, almacenar, visualizar y analizar reportes ambientales utilizando tecnologías frontend actuales.

El sistema se enfoca en un MVP funcional, priorizando:

* Autenticación local.
* CRUD de reportes ambientales.
* Persistencia mediante IndexedDB.
* Dashboard de indicadores.
* Mapa ambiental.
* Diseño responsivo.
* Documentación técnica.

---

# 6. Explicación del flujo principal del usuario

El flujo principal del usuario es el siguiente:

1. El usuario entra a la aplicación.
2. Se registra o inicia sesión.
3. Accede al dashboard.
4. Crea un reporte ambiental.
5. El sistema valida los datos del formulario.
6. El reporte se guarda en IndexedDB.
7. El reporte aparece en la lista de reportes.
8. El reporte se visualiza en el mapa mediante latitud y longitud.
9. El dashboard actualiza sus indicadores.
10. El usuario puede editar, eliminar o cambiar el estado del reporte.

Este flujo permite demostrar que el sistema no solo tiene pantallas, sino también una lógica funcional conectada con persistencia local.

---

# 7. Explicación de la arquitectura

GreenPulse está desarrollado con **Next.js** y **TypeScript**. La arquitectura se organizó por carpetas con responsabilidades claras para evitar código mezclado y facilitar el trabajo del equipo.

La estructura principal es:

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

La carpeta `app/` contiene las rutas principales de la aplicación.

La carpeta `components/` contiene componentes reutilizables de interfaz, como botones, inputs, tarjetas, badges y layout.

La carpeta `db/` contiene la configuración de Dexie e IndexedDB.

La carpeta `hooks/` contiene lógica reutilizable para conectar la interfaz con los datos.

La carpeta `schemas/` contiene validaciones con Zod.

La carpeta `types/` contiene las interfaces TypeScript del sistema.

La carpeta `utils/` contiene constantes y funciones auxiliares.

Esta arquitectura permite separar la interfaz, la lógica y la persistencia de datos.

---

# 8. Explicación técnica del flujo de datos

Cuando el usuario crea un reporte, la información sigue este recorrido:

```txt
Formulario
↓
Validación con Zod
↓
Hook personalizado
↓
Repositorio de datos
↓
Dexie
↓
IndexedDB
↓
Actualización de la interfaz
```

Esto significa que la pantalla no guarda los datos directamente. La información pasa por capas organizadas, lo que hace que el código sea más claro, mantenible y fácil de defender.

---

# 9. Reparto sugerido por integrante

## Persona 1 - UI/UX y frontend visual

La Persona 1 puede explicar:

* Diseño de pantallas.
* Layout principal.
* Navegación.
* Componentes reutilizables.
* Responsive design.
* Experiencia de usuario.

### Guion sugerido

Mi parte se enfocó en la interfaz visual del sistema. Para GreenPulse se buscó una interfaz clara, moderna y fácil de usar, donde el usuario pueda acceder rápidamente al dashboard, reportes y mapa.

Se trabajaron componentes reutilizables como botones, tarjetas, campos de formulario y elementos visuales. Esto permite mantener consistencia en toda la aplicación y evita repetir estilos en cada pantalla.

También se consideró el diseño responsivo para que la aplicación pueda utilizarse en computadora, tablet o celular.

---

## Persona 2 - IndexedDB, Dexie y persistencia

La Persona 2 puede explicar:

* Por qué se usó IndexedDB.
* Para qué sirve Dexie.
* Modelo de datos.
* Tablas principales.
* Persistencia al recargar.
* Repositorios de datos.

### Guion sugerido

Mi parte se enfocó en la persistencia local del sistema. Para esto se utilizó IndexedDB, que permite guardar datos directamente en el navegador de una forma más robusta que LocalStorage.

Para facilitar el manejo de IndexedDB, se utilizó Dexie.js. Con Dexie se definieron tablas para usuarios, reportes, categorías, historial de estados y configuración.

Esto permite que los reportes no se pierdan cuando el usuario recarga la página. Además, los datos guardados pueden ser utilizados por el dashboard, el mapa y la lista de reportes.

---

## Persona 3 - Reportes, dashboard y mapa

La Persona 3 puede explicar:

* CRUD de reportes.
* Filtros por categoría o estado.
* Indicadores del dashboard.
* Visualización de reportes.
* Mapa ambiental.
* Relación entre reportes y datos reales.

### Guion sugerido

Mi parte se enfocó en los módulos funcionales principales del MVP. El sistema permite crear, listar, editar y eliminar reportes ambientales.

Cada reporte contiene información como título, descripción, categoría, estado, prioridad, latitud y longitud. Estos datos permiten alimentar otras partes del sistema.

El dashboard utiliza los reportes guardados para mostrar indicadores como total de reportes, reportes pendientes, reportes resueltos y reportes por categoría.

El mapa utiliza la latitud y longitud de cada reporte para mostrar marcadores ambientales. De esta forma, el usuario puede identificar visualmente dónde se encuentran las incidencias.

---

## Persona 4 - Arquitectura, QA, documentación y defensa

La Persona 4 puede explicar:

* Organización general del proyecto.
* Estructura de carpetas.
* GitHub y ramas.
* Documentación técnica.
* Checklist de QA.
* Diagramas.
* Preparación de defensa.

### Guion sugerido

Mi parte se enfocó en la organización técnica y documental del proyecto. Se definió una estructura clara de carpetas para separar rutas, componentes, base de datos, hooks, validaciones, tipos y documentación.

También se organizó el repositorio en GitHub usando ramas como `main`, `develop` y ramas `feature`, para mantener un flujo de trabajo más ordenado.

Además, se prepararon documentos técnicos como arquitectura, flujo de datos, instalación, checklist de QA, decisiones técnicas, diagramas y guía de defensa.

Esto ayuda a que el proyecto no solo funcione, sino que también pueda explicarse de manera clara durante la defensa técnica.

---

# 10. Demostración funcional sugerida

Durante la demostración, el equipo puede seguir este orden:

1. Mostrar la pantalla principal.
2. Explicar brevemente el objetivo de GreenPulse.
3. Ir a registro o login.
4. Crear un usuario.
5. Iniciar sesión.
6. Entrar al dashboard.
7. Crear un reporte ambiental.
8. Mostrar que el reporte aparece en la lista.
9. Mostrar que el reporte aparece en el mapa.
10. Cambiar el estado del reporte.
11. Mostrar que el dashboard actualiza sus indicadores.
12. Recargar la página.
13. Demostrar que los datos no se pierden.

---

# 11. Preguntas técnicas probables

## ¿Por qué usaron IndexedDB?

Porque IndexedDB permite persistencia local real dentro del navegador. A diferencia de LocalStorage, permite guardar estructuras de datos más completas y manejar información como usuarios, reportes, categorías e historial.

## ¿Por qué usaron Dexie?

Dexie facilita el uso de IndexedDB. IndexedDB puede ser más complejo si se usa directamente, por lo que Dexie permite crear tablas, hacer consultas y realizar operaciones CRUD de forma más sencilla.

## ¿Qué pasa si se recarga la página?

Los datos principales se mantienen porque están guardados en IndexedDB. Al recargar, el sistema consulta nuevamente la base local y reconstruye la lista de reportes, el dashboard y el mapa.

## ¿Por qué no usaron backend?

Porque el alcance inicial del MVP se centra en una aplicación frontend con persistencia local. Esto reduce la complejidad y permite cumplir mejor con los criterios principales del proyecto.

## ¿Cómo evitaron código desordenado?

Se separó el proyecto en carpetas con responsabilidades claras: rutas, componentes, base de datos, hooks, validaciones, tipos, utilidades y documentación.

## ¿Qué hace el dashboard?

El dashboard resume los reportes ambientales registrados. Puede mostrar indicadores como total de reportes, reportes por estado, reportes por categoría y reportes resueltos.

## ¿Qué hace el mapa?

El mapa muestra los reportes ambientales según su ubicación geográfica. Cada reporte guarda latitud y longitud, y esos datos se usan para colocar marcadores.

## ¿Qué validaciones tiene el sistema?

El sistema utiliza Zod para validar formularios como login, registro y creación de reportes. Esto evita guardar datos vacíos o incorrectos.

## ¿Qué tecnologías usaron?

Se utilizaron Next.js, TypeScript, Tailwind CSS, IndexedDB, Dexie.js, Zod, Leaflet y Recharts.

---

# 12. Respuestas breves de emergencia

## Si preguntan qué es GreenPulse

GreenPulse es una aplicación web para registrar, visualizar y analizar reportes ambientales mediante un dashboard, un mapa e IndexedDB como persistencia local.

## Si preguntan cuál es el módulo principal

El módulo principal es el de reportes ambientales, porque conecta la captura de datos, la persistencia, el mapa y el dashboard.

## Si preguntan qué hace IndexedDB

IndexedDB guarda los datos localmente en el navegador para que no se pierdan al recargar la página.

## Si preguntan qué hace Dexie

Dexie es una librería que simplifica el uso de IndexedDB.

## Si preguntan qué hace Zod

Zod valida los datos antes de guardarlos.

## Si preguntan qué hace Leaflet

Leaflet permite mostrar mapas interactivos con marcadores.

## Si preguntan qué hace Recharts

Recharts permite mostrar gráficas e indicadores visuales en el dashboard.

---

# 13. Cierre sugerido

Como conclusión, GreenPulse es una solución web enfocada en organizar reportes ambientales de forma clara y funcional. El sistema permite registrar incidencias, guardarlas localmente, visualizarlas en un mapa y analizarlas mediante un dashboard.

El proyecto prioriza un MVP estable y defendible, usando tecnologías modernas como Next.js, TypeScript, IndexedDB y Dexie. Además, se organizó con una arquitectura modular y documentación técnica para facilitar el mantenimiento, el trabajo en equipo y la defensa del proyecto.

---

# 14. Recomendaciones para la defensa

* No memorizar todo palabra por palabra.
* Entender el flujo general del sistema.
* Cada integrante debe explicar su módulo.
* Evitar explicar código línea por línea.
* Usar diagramas para apoyar la explicación.
* Demostrar primero lo funcional y luego lo técnico.
* Si algo falla durante la demo, explicar qué debería ocurrir y mostrar la parte documentada.
* Mantener la explicación clara, breve y segura.
