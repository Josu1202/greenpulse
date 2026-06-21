# Guía de instalación - GreenPulse

Este documento explica cómo instalar y ejecutar el proyecto GreenPulse en un entorno local de desarrollo.

## Requisitos previos

Antes de instalar el proyecto, se recomienda tener instalado:

* Node.js
* npm
* Git
* Visual Studio Code o editor similar
* Navegador web moderno

## Clonar el repositorio

Para descargar el proyecto desde GitHub, ejecutar:

```bash
git clone URL_DEL_REPOSITORIO
```

Ejemplo:

```bash
git clone https://github.com/usuario/greenpulse.git
```

Luego entrar a la carpeta del proyecto:

```bash
cd greenpulse
```

## Instalar dependencias

Una vez dentro del proyecto, instalar las dependencias con:

```bash
npm install
```

Este comando descarga todas las librerías necesarias para ejecutar GreenPulse.

## Ejecutar el proyecto

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Luego abrir el navegador en:

```txt
http://localhost:3000
```

## Estructura principal del proyecto

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

docs/
```

## Comandos importantes

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Compilar el proyecto:

```bash
npm run build
```

Ejecutar revisión de código:

```bash
npm run lint
```

## Posibles errores comunes

## Error: dependencias no instaladas

Si aparece un error relacionado con módulos no encontrados, ejecutar:

```bash
npm install
```

## Error: puerto ocupado

Si el puerto `3000` está ocupado, Next.js puede sugerir otro puerto automáticamente. También se puede cerrar el proceso anterior o ejecutar nuevamente el servidor.

## Error: problemas después de clonar

Si el proyecto fue clonado recientemente y no ejecuta correctamente, probar:

```bash
rm -rf node_modules
npm install
npm run dev
```

En Windows, si no funciona `rm -rf`, se puede eliminar manualmente la carpeta `node_modules` y volver a ejecutar:

```bash
npm install
```

## Flujo recomendado para trabajar

Antes de empezar una tarea:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-tarea
```

Después de terminar:

```bash
git add .
git commit -m "tipo: descripcion del cambio"
git push origin feature/nombre-de-la-tarea
```

Luego se debe crear un Pull Request hacia `develop`.

## Nota importante

El proyecto debe ejecutarse localmente antes de subir cambios a GitHub. No se debe integrar código que rompa la ejecución, genere errores en consola o afecte la estructura general del proyecto.
