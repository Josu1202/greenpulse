# Diagramas técnicos - GreenPulse

Este documento contiene los diagramas principales del proyecto GreenPulse. Su objetivo es facilitar la comprensión de la arquitectura, el flujo de datos, el modelo de almacenamiento local y la organización del desarrollo.

Los diagramas están escritos con sintaxis Mermaid, compatible con GitHub.

---

# 1. Diagrama de arquitectura general

```mermaid
flowchart LR
    A[Usuario] --> B[Next.js App Router]
    B --> C[Pages / Rutas]
    C --> D[Componentes UI]
    D --> E[Hooks personalizados]
    E --> F[Repositorios]
    F --> G[Dexie.js]
    G --> H[IndexedDB]

    C --> I[Dashboard]
    C --> J[Reportes]
    C --> K[Mapa ambiental]

    H --> I
    H --> J
    H --> K
```

## Explicación

La arquitectura de GreenPulse se organiza como una aplicación frontend moderna. El usuario interactúa con páginas de Next.js, estas páginas usan componentes reutilizables, los componentes se conectan con hooks personalizados, los hooks llaman a repositorios y los repositorios se comunican con Dexie para guardar o consultar datos en IndexedDB.

Esta organización permite separar responsabilidades y evitar que la lógica del sistema quede mezclada directamente en las pantallas.

---

# 2. Diagrama del flujo principal del usuario

```mermaid
flowchart TD
    A[Inicio] --> B[Registro o Login]
    B --> C[Dashboard]
    C --> D[Crear reporte ambiental]
    D --> E[Validar datos]
    E --> F[Guardar en IndexedDB]
    F --> G[Mostrar en lista de reportes]
    F --> H[Mostrar marcador en mapa]
    F --> I[Actualizar indicadores del dashboard]
    G --> J[Editar o eliminar reporte]
    J --> F
```

## Explicación

El flujo principal inicia cuando el usuario entra al sistema, se registra o inicia sesión. Luego puede crear reportes ambientales. Cada reporte se valida y se almacena en IndexedDB. Después, el sistema actualiza la lista de reportes, el mapa ambiental y el dashboard.

---

# 3. Diagrama de flujo de datos

```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as Interfaz
    participant C as Componente
    participant H as Hook
    participant R as Repositorio
    participant D as Dexie
    participant DB as IndexedDB

    U->>UI: Completa formulario
    UI->>C: Envía datos
    C->>H: Llama función del hook
    H->>R: Solicita crear o actualizar datos
    R->>D: Ejecuta operación con Dexie
    D->>DB: Guarda información
    DB-->>D: Confirma operación
    D-->>R: Retorna resultado
    R-->>H: Devuelve datos actualizados
    H-->>C: Actualiza estado
    C-->>UI: Refresca vista
```

## Explicación

Este diagrama muestra cómo se mueve la información desde la acción del usuario hasta el almacenamiento local. La interfaz no se comunica directamente con IndexedDB, sino que pasa por componentes, hooks y repositorios. Esto mantiene el código más limpio y defendible.

---

# 4. Diagrama del modelo de datos

```mermaid
erDiagram
    USER ||--o{ REPORT : creates
    CATEGORY ||--o{ REPORT : classifies
    REPORT ||--o{ STATUS_LOG : has
    SETTINGS ||--|| USER : configures

    USER {
        string id
        string name
        string email
        string password
        string role
        string createdAt
    }

    REPORT {
        string id
        string userId
        string title
        string description
        string categoryId
        string status
        string priority
        number latitude
        number longitude
        string image
        string createdAt
        string updatedAt
    }

    CATEGORY {
        string id
        string name
        string color
        string description
        number impactFactor
    }

    STATUS_LOG {
        string id
        string reportId
        string previousStatus
        string newStatus
        string changedAt
    }

    SETTINGS {
        string id
        string theme
        object defaultMapCenter
        boolean seedLoaded
    }
```

## Explicación

El modelo de datos se basa en cinco entidades principales:

* `User`: representa usuarios locales.
* `Report`: representa incidencias ambientales.
* `Category`: clasifica los reportes por tipo de problema.
* `StatusLog`: registra cambios de estado.
* `Settings`: guarda configuración inicial de la aplicación.

La entidad central es `Report`, porque conecta al usuario, la categoría, el mapa, el dashboard y el historial de estados.

---

# 5. Diagrama de persistencia local

```mermaid
flowchart TD
    A[Formulario de reporte] --> B[Validación con Zod]
    B --> C{Datos válidos?}
    C -->|No| D[Mostrar mensaje de error]
    C -->|Sí| E[Crear objeto Report]
    E --> F[Repositorio de reportes]
    F --> G[Dexie.js]
    G --> H[IndexedDB]
    H --> I[Reporte persistido]
    I --> J[Actualizar Dashboard]
    I --> K[Actualizar Mapa]
    I --> L[Actualizar Lista]
```

## Explicación

Antes de guardar un reporte, el sistema debe validar los datos. Si los datos son correctos, se crea el objeto `Report` y se almacena mediante Dexie en IndexedDB. Luego, la información guardada se usa para actualizar las demás secciones del sistema.

---

# 6. Diagrama de módulos del MVP

```mermaid
mindmap
  root((GreenPulse MVP))
    Autenticación local
      Registro
      Login
      Sesión local
    Reportes ambientales
      Crear
      Listar
      Editar
      Eliminar
      Filtrar
    IndexedDB
      Usuarios
      Reportes
      Categorías
      Historial
      Configuración
    Dashboard
      Total de reportes
      Por categoría
      Por estado
      Por prioridad
    Mapa ambiental
      Marcadores
      Ubicación
      Detalle del reporte
      Filtros
    Documentación
      README
      Arquitectura
      Flujo de datos
      QA
      Defensa
```

## Explicación

El MVP de GreenPulse se enfoca en seis áreas principales: autenticación local, reportes, persistencia con IndexedDB, dashboard, mapa ambiental y documentación. Las funciones avanzadas como IA, IoT o predicción quedan como extras posteriores.

---

# 7. Diagrama de ramas en GitHub

```mermaid
gitGraph
    commit id: "Inicio"
    branch develop
    checkout develop
    commit id: "Estructura base"

    branch feature/docs
    checkout feature/docs
    commit id: "README y documentación"
    checkout develop
    merge feature/docs

    branch feature/base-types
    checkout feature/base-types
    commit id: "Tipos y Dexie"
    checkout develop
    merge feature/base-types

    branch feature/repositories
    checkout feature/repositories
    commit id: "Repositorios y hooks"
    checkout develop
    merge feature/repositories

    branch feature/validations
    checkout feature/validations
    commit id: "Validaciones y UI"
    checkout develop
    merge feature/validations

    branch feature/layout-base
    checkout feature/layout-base
    commit id: "Layout y páginas"
    checkout develop
    merge feature/layout-base
```

## Explicación

La estrategia de ramas permite mantener el proyecto ordenado. La rama `main` se reserva para versiones estables, `develop` integra los avances del equipo y cada rama `feature` se usa para desarrollar una parte específica.

---

# 8. Diagrama de responsabilidades del equipo

```mermaid
flowchart TD
    A[Equipo GreenPulse] --> B[Persona 1: UI/UX]
    A --> C[Persona 2: IndexedDB]
    A --> D[Persona 3: Módulos funcionales]
    A --> E[Persona 4: Arquitectura, QA y documentación]

    B --> B1[Layout]
    B --> B2[Componentes visuales]
    B --> B3[Responsive design]

    C --> C1[Dexie]
    C --> C2[Repositorios]
    C --> C3[Persistencia local]

    D --> D1[Reportes]
    D --> D2[Dashboard]
    D --> D3[Mapa]
    D --> D4[Filtros]

    E --> E1[README]
    E --> E2[Documentación]
    E --> E3[Checklist QA]
    E --> E4[Defensa técnica]
```

## Explicación

Aunque el equipo puede apoyarse entre sí, cada persona tiene responsabilidades principales. Esta distribución ayuda a organizar el trabajo y facilita explicar quién desarrolló cada parte durante la defensa.

---

# 9. Uso de los diagramas en defensa

Durante la defensa técnica, los diagramas pueden usarse para explicar:

1. Cómo está organizada la arquitectura.
2. Cómo fluye la información.
3. Cómo se guardan los datos en IndexedDB.
4. Qué módulos forman el MVP.
5. Cómo se organizó el trabajo en GitHub.
6. Qué responsabilidad tuvo cada integrante.

Estos diagramas no reemplazan la explicación oral, pero sirven como apoyo visual para demostrar orden, planificación y dominio técnico.
