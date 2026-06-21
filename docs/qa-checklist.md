# Checklist de QA - GreenPulse

Este documento contiene las pruebas mínimas que deben realizarse antes de considerar terminada una funcionalidad del proyecto GreenPulse.

## 1. Revisión general del proyecto

* [ ] El proyecto ejecuta correctamente con `npm run dev`.
* [ ] El proyecto no muestra errores en consola.
* [ ] El proyecto no muestra errores visuales graves.
* [ ] Las rutas principales cargan correctamente.
* [ ] No hay archivos innecesarios o duplicados.
* [ ] La estructura de carpetas se mantiene ordenada.
* [ ] Los nombres de archivos y componentes son claros.
* [ ] El código usa TypeScript correctamente.

## 2. Pruebas de responsive design

* [ ] La aplicación se visualiza correctamente en escritorio.
* [ ] La aplicación se visualiza correctamente en tablet.
* [ ] La aplicación se visualiza correctamente en móvil.
* [ ] No hay elementos desbordados horizontalmente.
* [ ] Los botones son fáciles de presionar en pantallas pequeñas.
* [ ] Los textos son legibles.
* [ ] El menú o navegación se adapta correctamente.

## 3. Pruebas de autenticación local

* [ ] El usuario puede registrarse.
* [ ] El sistema valida campos vacíos.
* [ ] El sistema valida correo electrónico.
* [ ] El usuario puede iniciar sesión.
* [ ] El sistema muestra mensajes de error si los datos son incorrectos.
* [ ] El usuario puede cerrar sesión.
* [ ] La sesión se mantiene correctamente mientras corresponde.
* [ ] No se permite acceder a pantallas protegidas sin sesión, si aplica.

## 4. Pruebas de reportes ambientales

* [ ] El usuario puede crear un reporte ambiental.
* [ ] El formulario valida campos obligatorios.
* [ ] El reporte guarda título.
* [ ] El reporte guarda descripción.
* [ ] El reporte guarda categoría.
* [ ] El reporte guarda estado.
* [ ] El reporte guarda prioridad.
* [ ] El reporte guarda latitud y longitud.
* [ ] El reporte puede listar los datos guardados.
* [ ] El reporte puede editarse.
* [ ] El reporte puede eliminarse.
* [ ] El estado del reporte puede actualizarse.

## 5. Pruebas de IndexedDB

* [ ] La base de datos se crea correctamente en el navegador.
* [ ] Los usuarios se guardan en IndexedDB.
* [ ] Los reportes se guardan en IndexedDB.
* [ ] Las categorías se guardan o cargan correctamente.
* [ ] Al recargar la página, los reportes no se pierden.
* [ ] Al cerrar y abrir el navegador, los datos siguen disponibles.
* [ ] No se usa LocalStorage como persistencia principal.
* [ ] Las operaciones CRUD funcionan de forma asincrónica.

## 6. Pruebas del dashboard

* [ ] El dashboard muestra el total de reportes.
* [ ] El dashboard muestra reportes por categoría.
* [ ] El dashboard muestra reportes por estado.
* [ ] El dashboard muestra indicadores comprensibles.
* [ ] Las gráficas cargan correctamente.
* [ ] Los indicadores cambian al crear un reporte.
* [ ] Los indicadores cambian al editar un reporte.
* [ ] Los indicadores cambian al eliminar un reporte.
* [ ] El dashboard usa datos reales desde IndexedDB.

## 7. Pruebas del mapa ambiental

* [ ] El mapa carga correctamente.
* [ ] Los reportes aparecen como marcadores.
* [ ] Cada marcador usa latitud y longitud.
* [ ] Al seleccionar un marcador se muestra información del reporte.
* [ ] Los filtros afectan los marcadores visibles.
* [ ] El mapa no genera errores en consola.
* [ ] El mapa funciona correctamente al recargar la página.

## 8. Pruebas de filtros

* [ ] Se puede filtrar por categoría.
* [ ] Se puede filtrar por estado.
* [ ] Se puede filtrar por prioridad, si aplica.
* [ ] Los filtros actualizan la lista de reportes.
* [ ] Los filtros actualizan el mapa.
* [ ] Los filtros no eliminan datos reales.
* [ ] Existe una opción para limpiar filtros, si aplica.

## 9. Pruebas de documentación

* [ ] El README está actualizado.
* [ ] La guía de instalación está actualizada.
* [ ] La arquitectura está documentada.
* [ ] El flujo de datos está documentado.
* [ ] El checklist de QA está actualizado.
* [ ] La guía de defensa técnica está actualizada.
* [ ] Las decisiones técnicas importantes están registradas.

## 10. Pruebas para defensa técnica

* [ ] El equipo puede explicar el objetivo del proyecto.
* [ ] El equipo puede explicar el flujo principal del usuario.
* [ ] El equipo puede explicar por qué se usó IndexedDB.
* [ ] El equipo puede explicar cómo fluye la información.
* [ ] El equipo puede explicar la estructura de carpetas.
* [ ] El equipo puede explicar cómo se actualiza el dashboard.
* [ ] El equipo puede explicar cómo se muestran reportes en el mapa.
* [ ] Cada integrante puede explicar su módulo.
* [ ] La demostración completa funciona sin errores.

## Definition of Done

Una funcionalidad se considera terminada solo si:

* [ ] Funciona correctamente.
* [ ] No genera errores en consola.
* [ ] Tiene validaciones mínimas.
* [ ] Responde en móvil.
* [ ] Usa TypeScript correctamente.
* [ ] Persiste datos si corresponde.
* [ ] No rompe otros módulos.
* [ ] Puede explicarse técnicamente.
* [ ] Está documentada si afecta arquitectura, instalación o uso.
