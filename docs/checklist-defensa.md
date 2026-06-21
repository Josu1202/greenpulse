# Checklist de defensa - GreenPulse

Este documento sirve para preparar la exposición y defensa técnica del proyecto GreenPulse.

## 1. Antes de la defensa

* [ ] El proyecto ejecuta correctamente con `npm run dev`.
* [ ] No hay errores visibles en consola.
* [ ] El repositorio está actualizado en GitHub.
* [ ] La rama estable contiene la versión final.
* [ ] El README está actualizado.
* [ ] La documentación principal está completa.
* [ ] El equipo conoce el flujo general del sistema.
* [ ] Cada integrante sabe explicar su módulo.
* [ ] La demostración fue ensayada antes de presentar.

## 2. Flujo mínimo que debe demostrarse

Durante la defensa, el equipo debe poder mostrar:

* [ ] Pantalla inicial o login.
* [ ] Registro o inicio de sesión local.
* [ ] Dashboard principal.
* [ ] Creación de un reporte ambiental.
* [ ] Guardado del reporte.
* [ ] Visualización del reporte en lista.
* [ ] Visualización del reporte en mapa.
* [ ] Actualización de indicadores en dashboard.
* [ ] Recarga de página sin pérdida de datos.

## 3. Explicación del problema

El equipo debe poder explicar:

* [ ] Qué problema ambiental se identificó.
* [ ] Por qué los reportes informales son una limitación.
* [ ] Cómo GreenPulse organiza la información.
* [ ] Cómo el mapa ayuda a visualizar zonas críticas.
* [ ] Cómo el dashboard ayuda a tomar decisiones.

## 4. Explicación técnica

El equipo debe poder explicar:

* [ ] Por qué se usó Next.js.
* [ ] Por qué se usó TypeScript.
* [ ] Por qué se usó IndexedDB.
* [ ] Para qué sirve Dexie.
* [ ] Qué datos se guardan localmente.
* [ ] Qué pasa si se recarga la página.
* [ ] Cómo se conecta el formulario con la base de datos.
* [ ] Cómo se actualiza el dashboard.
* [ ] Cómo se muestran los marcadores en el mapa.

## 5. Explicación de arquitectura

El equipo debe poder explicar la función de estas carpetas:

* [ ] `src/app/`
* [ ] `src/components/`
* [ ] `src/features/`
* [ ] `src/db/`
* [ ] `src/hooks/`
* [ ] `src/types/`
* [ ] `src/schemas/`
* [ ] `src/utils/`
* [ ] `docs/`

## 6. Preguntas probables

## ¿Por qué usaron IndexedDB y no LocalStorage?

Porque IndexedDB permite almacenar estructuras más completas y funciona mejor como base de datos local. LocalStorage solo se recomienda para datos pequeños, como sesión o preferencias.

## ¿Qué pasa al recargar la página?

Los datos importantes se mantienen porque están guardados en IndexedDB. Al cargar nuevamente la aplicación, el sistema consulta esos datos y reconstruye la lista, el mapa y el dashboard.

## ¿Por qué no usaron backend?

Porque el alcance inicial del proyecto se centra en una aplicación frontend con persistencia local. Esto reduce complejidad y permite cumplir mejor con el MVP.

## ¿Cómo evitaron código desordenado?

Se organizó el proyecto por carpetas con responsabilidades claras: rutas, componentes, features, hooks, base de datos, tipos, validaciones y documentación.

## ¿Cómo se valida que el sistema funciona?

Mediante pruebas manuales, checklist de QA, revisión de errores en consola, pruebas de persistencia y pruebas de responsive design.

## 7. Reparto sugerido de exposición

| Parte                      | Responsable sugerido                       |
| -------------------------- | ------------------------------------------ |
| Problema y objetivo        | Persona 4 o integrante con mejor expresión |
| UI y navegación            | Persona 1                                  |
| IndexedDB y persistencia   | Persona 2                                  |
| Reportes, dashboard y mapa | Persona 3                                  |
| Arquitectura, QA y cierre  | Persona 4                                  |

## 8. Cierre sugerido

GreenPulse es una solución web enfocada en registrar, visualizar y analizar reportes ambientales de forma organizada. El proyecto prioriza un MVP funcional con persistencia local, mapa ambiental, dashboard, diseño responsivo y una arquitectura clara. Esto permite que la aplicación sea útil, comprensible y técnicamente defendible.
