# Proyecto Final

[Parte 1 del curso](https://www.artisanfront.com/cursos/curso-fastify-desde-0/fastify-12-proyecto-final-1-de-3)
[Parte 2 del curso](https://www.artisanfront.com/cursos/curso-fastify-desde-0/fastify-13-proyecto-final-2-de-3)
[Parte 3 del curso](https://www.artisanfront.com/cursos/curso-fastify-desde-0/fastify-14-proyecto-final-3-de-3)

[¿Cómo instalar los demos?](../README.md)

## Configurar Firebase

Se requiere crear en esta misma carpeta el archivo `firebase.json` en la primera parte del curso se muestra paso a paso como generar este archivo en Firebase.

## Construir React

Observarás que hay una carpeta llamada `src` en esa carpeta estan todos los archivos relacionados con el Front que va a consumir la API Fastify + Firebase que vamos a crear. Para construir el front basta con ejecutar el siguiente comando:

```sh
npm run build:app
```

Este comando te debió crear una carpeta llamada `build`, una vez que tengas esa carpeta y tu archivo `firebase.json` ya podrás ejecutar el demo con el comando:

```sh
node index.js
```

Ahora si visitas la ruta raíz vas a ver las vistas creadas con React y podrás interacturar con API REST definida en el archivo `server.js`
