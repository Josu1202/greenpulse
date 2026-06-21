# Flujo de datos de GreenPulse

El flujo de datos de GreenPulse describe cómo se mueve la información desde la interacción del usuario hasta la persistencia local en IndexedDB y la actualización visual de la interfaz.

## Flujo general

```txt
Usuario
↓
Interfaz de usuario
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
Estado actualizado
↓
Dashboard / Mapa / Lista de reportes
```

## Ejemplo 1: registro de usuario

1. El usuario ingresa nombre, correo y contraseña.
2. El formulario valida los campos.
3. El sistema verifica si el correo ya existe.
4. El usuario se guarda en IndexedDB.
5. Se crea una sesión local.
6. El usuario es redirigido al dashboard.

## Ejemplo 2: inicio de sesión

1. El usuario ingresa correo y contraseña.
2. El sistema busca el usuario en IndexedDB.
3. Se validan las credenciales.
4. Si son correctas, se guarda la sesión activa.
5. El usuario accede al dashboard.

## Ejemplo 3: creación de reporte ambiental

1. El usuario abre el formulario de nuevo reporte.
2. Completa título, descripción, categoría, prioridad, ubicación e imagen.
3. El formulario valida los campos obligatorios.
4. El sistema crea un objeto de tipo Report.
5. El reporte se guarda en IndexedDB.
6. La lista de reportes se actualiza.
7. El mapa muestra un nuevo marcador.
8. El dashboard recalcula los indicadores.

## Ejemplo 4: actualización de estado

1. El usuario selecciona un reporte.
2. Cambia el estado del reporte.
3. El sistema actualiza el registro en IndexedDB.
4. Se crea un registro en StatusLog.
5. El dashboard actualiza el conteo por estado.
6. La lista de reportes muestra el nuevo estado.

## Ejemplo 5: visualización en mapa

1. El sistema obtiene los reportes guardados.
2. Filtra los reportes según categoría o estado.
3. Lee latitud y longitud de cada reporte.
4. Muestra los marcadores en el mapa.
5. Al seleccionar un marcador, muestra el detalle del reporte.

## Datos principales

## User

Representa a los usuarios locales del sistema.

Campos sugeridos:

```txt
id
name
email
passwordHash o demoPassword
role
createdAt
```

## Report

Representa cada incidencia ambiental.

Campos sugeridos:

```txt
id
userId
title
description
categoryId
status
priority
latitude
longitude
image
createdAt
updatedAt
```

## Category

Representa las categorías ambientales.

Campos sugeridos:

```txt
id
name
color
description
impactFactor
```

## StatusLog

Representa el historial de cambios de estado.

Campos sugeridos:

```txt
id
reportId
previousStatus
newStatus
changedAt
```

## Settings

Representa configuraciones básicas del sistema.

Campos sugeridos:

```txt
id
theme
defaultMapCenter
seedLoaded
```

## Importancia de IndexedDB

IndexedDB permite que los datos importantes del sistema permanezcan guardados aunque el usuario recargue la página o cierre el navegador.

En GreenPulse, IndexedDB se usará para:

* Usuarios.
* Reportes.
* Categorías.
* Historial de estados.
* Configuraciones.

LocalStorage solo debe usarse para datos pequeños, como sesión activa o preferencias simples.
