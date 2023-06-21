# Requisitos

Para poder utilizar este proyecto, es necesario tener instalados los siguientes requisitos:

- Node.js
- React

## Instalar dependencias

Una vez que tengas instalados los requisitos, clona el repositorio en el directorio que desees. Luego, dentro de la carpeta que contiene la solución React, ejecuta el siguiente comando para instalar todas las dependencias utilizadas:
npm install


## Credenciales de la base de datos

Para modificar las credenciales de la base de datos, debes ir a la carpeta "API" y abrir el archivo "Server.js". En ese archivo, podrás modificar la variable `dbConfig` con las credenciales correspondientes.

## Ejecutar el Cliente y el Servidor

Debido a que el backend y el frontend están separados, debes ejecutarlos de forma independiente.

### Ejecutar el servidor

Para ejecutar el servidor, sitúate en el directorio donde se encuentra el archivo "Server.js" y ejecuta el siguiente comando:
```bash
node Server.js
```
Deberás ver un mensaje que indique: "Servidor escuchando en el puerto 8000".

### Ejecutar el cliente

Una vez hecho lo anterior, dirígete al directorio donde se encuentra el proyecto "solucionreact" y ejecuta el siguiente comando:
```bash
npm start
```
Una vez finalizada la ejecución, se mostrará la interfaz en tu navegador.

## Llenar la base de datos

Para llenar la base de datos, primero debes iniciar el servidor y luego el cliente ("solucionreact"). Una vez hecho esto, abre el enlace `http://localhost:3000/creardb` en tu navegador y haz clic en el botón correspondiente. Una vez finalizado, se mostrará un mensaje de finalización.

