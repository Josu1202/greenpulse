# Manual de usuario - GreenPulse

## 1. Introducción

GreenPulse es una plataforma web de reportes y monitoreo ambiental que permite registrar, visualizar y analizar incidencias ambientales dentro de una comunidad educativa o zona local.

El sistema está diseñado para que los usuarios puedan reportar problemas ambientales como acumulación de residuos, contaminación del agua, afectación de vegetación, contaminación del aire o ruido excesivo. Estos reportes se almacenan localmente en el navegador mediante IndexedDB y pueden visualizarse en una lista, un mapa ambiental y un dashboard de indicadores.

## 2. Objetivo del manual

Este manual explica el uso básico de GreenPulse desde la perspectiva del usuario final. Su propósito es orientar al usuario sobre cómo ingresar al sistema, crear reportes ambientales, consultar información y comprender las principales secciones de la aplicación.

## 3. Requisitos para usar la aplicación

Para utilizar GreenPulse se necesita:

* Una computadora, tablet o celular.
* Un navegador web moderno.
* Acceso local al proyecto en ejecución.
* Tener iniciado el servidor de desarrollo con `npm run dev`.

La aplicación funciona de forma local y guarda la información principal mediante IndexedDB dentro del navegador.

## 4. Acceso a la aplicación

Para acceder a GreenPulse, se debe abrir el navegador e ingresar a:

```txt
http://localhost:3000
```

Al ingresar, se muestra la pantalla principal del sistema, donde se presenta una introducción al proyecto y accesos hacia las secciones principales.

## 5. Pantalla principal

La pantalla principal presenta el objetivo general de GreenPulse y resume el flujo básico del sistema:

1. El usuario inicia sesión o se registra.
2. Crea un reporte ambiental.
3. El reporte se guarda localmente.
4. El reporte se visualiza en el mapa y dashboard.

Desde esta pantalla, el usuario puede acceder a:

* Inicio.
* Dashboard.
* Reportes.
* Mapa.
* Login.
* Registro.

## 6. Registro de usuario

La sección de registro permite crear un usuario local dentro de la aplicación.

Para registrarse, el usuario debe ingresar:

* Nombre.
* Correo electrónico.
* Contraseña.

Después de completar el formulario, el sistema valida los datos y guarda el usuario en IndexedDB.

### Validaciones esperadas

El sistema debe validar que:

* El nombre no esté vacío.
* El correo tenga formato válido.
* La contraseña cumpla con la longitud mínima.
* No exista otro usuario con el mismo correo.

## 7. Inicio de sesión

La sección de inicio de sesión permite acceder al sistema usando un usuario previamente registrado.

El usuario debe ingresar:

* Correo electrónico.
* Contraseña.

Si los datos son correctos, el sistema crea una sesión local y permite acceder a las funciones principales.

### Errores posibles

El sistema puede mostrar mensajes si:

* El correo no existe.
* La contraseña es incorrecta.
* Hay campos vacíos.
* El formato del correo no es válido.

## 8. Dashboard

El dashboard muestra un resumen visual de los reportes ambientales registrados.

Los indicadores principales pueden incluir:

* Total de reportes.
* Reportes pendientes.
* Reportes en revisión.
* Reportes resueltos.
* Reportes por categoría.
* Reportes por prioridad.

El dashboard se actualiza con la información guardada en IndexedDB. Por lo tanto, si se crea, edita o elimina un reporte, los indicadores deben cambiar automáticamente.

## 9. Reportes ambientales

La sección de reportes permite administrar las incidencias ambientales registradas.

Desde esta sección, el usuario puede:

* Crear reportes.
* Consultar reportes existentes.
* Editar reportes.
* Eliminar reportes.
* Filtrar reportes por categoría o estado.

## 10. Crear un reporte ambiental

Para crear un reporte, el usuario debe completar un formulario con los siguientes datos:

* Título del reporte.
* Descripción del problema.
* Categoría ambiental.
* Prioridad.
* Estado.
* Latitud.
* Longitud.
* Imagen opcional.

### Categorías sugeridas

Las categorías base del sistema son:

* Residuos.
* Agua.
* Aire.
* Vegetación.
* Ruido.

### Estados del reporte

Los estados principales son:

* Pendiente.
* En revisión.
* Resuelto.

### Prioridades

Las prioridades principales son:

* Baja.
* Media.
* Alta.

## 11. Guardado del reporte

Al guardar el reporte, el sistema valida los datos ingresados y luego almacena la información en IndexedDB.

Esto permite que el reporte no se pierda al recargar la página o cerrar el navegador.

## 12. Consulta de reportes

Los reportes guardados pueden visualizarse en una lista o tabla.

Cada reporte debe mostrar información básica como:

* Título.
* Categoría.
* Estado.
* Prioridad.
* Fecha de creación.
* Ubicación.
* Acciones disponibles.

## 13. Edición de reportes

La edición permite modificar los datos de un reporte existente.

El usuario puede actualizar campos como:

* Título.
* Descripción.
* Categoría.
* Estado.
* Prioridad.
* Ubicación.
* Imagen.

Al guardar los cambios, el sistema actualiza la información en IndexedDB.

## 14. Eliminación de reportes

El usuario puede eliminar reportes que ya no sean necesarios.

Al eliminar un reporte, este desaparece de la lista, del dashboard y del mapa ambiental.

## 15. Mapa ambiental

La sección de mapa permite visualizar los reportes según su ubicación geográfica.

Cada reporte se representa mediante un marcador en el mapa usando los valores de latitud y longitud.

Al seleccionar un marcador, el sistema puede mostrar información resumida del reporte, como:

* Título.
* Categoría.
* Estado.
* Prioridad.
* Descripción breve.

## 16. Filtros

El sistema puede permitir filtrar reportes por:

* Categoría.
* Estado.
* Prioridad.

Los filtros ayudan a encontrar reportes específicos y a visualizar zonas o problemas ambientales determinados.

## 17. Persistencia de datos

GreenPulse utiliza IndexedDB como sistema de almacenamiento local.

Esto significa que los datos principales se guardan en el navegador y permanecen disponibles aunque el usuario recargue la página.

Los datos que se almacenan localmente incluyen:

* Usuarios.
* Reportes.
* Categorías.
* Historial de cambios de estado.
* Configuración básica.

## 18. Cierre de sesión

El usuario puede cerrar sesión desde la interfaz del sistema.

Al cerrar sesión, se elimina la sesión activa, pero los datos principales permanecen guardados en IndexedDB.

## 19. Recomendaciones de uso

Para utilizar correctamente GreenPulse, se recomienda:

* Ingresar información clara en cada reporte.
* Seleccionar la categoría adecuada.
* Usar una descripción breve pero suficiente.
* Colocar coordenadas válidas.
* Actualizar el estado del reporte cuando corresponda.
* Revisar el dashboard para conocer el resumen ambiental.
* Usar el mapa para identificar zonas críticas.

## 20. Limitaciones del MVP

La versión inicial de GreenPulse funciona como un MVP académico. Por eso, algunas funciones avanzadas quedan fuera del alcance inicial.

No se incluye en la fase inicial:

* Backend real.
* Autenticación empresarial.
* IA entrenada en producción.
* Sensores IoT físicos.
* Predicciones avanzadas con datos reales.

Estas funciones pueden agregarse en fases posteriores si el MVP se encuentra estable.

## 21. Conclusión

GreenPulse permite registrar, organizar y visualizar reportes ambientales de manera sencilla. Su enfoque principal es ofrecer una plataforma funcional, clara y defendible técnicamente, utilizando tecnologías modernas como Next.js, TypeScript e IndexedDB.

Este manual sirve como guía básica para comprender el uso del sistema desde la perspectiva del usuario final.
