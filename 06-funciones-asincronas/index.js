const fastify = require("fastify");

const server = fastify({
  logger: {
    level: "warn",
    prettyPrint: true,
  },
});

// Simulacion de funciones de base de datos y validaciones

//  Con esta simple promesa vamos a validar que el token en cabecera sea "admin",
//  caso contrario rechazamos la promesa
const validarToken = (token) =>
  new Promise((resolve, reject) => {
    if (token === "admin") {
      resolve();
    } else {
      reject();
    }
  });

//  Funcion que simula obtener datos de una base de datos
const obtenerDeBaseDeDatos = async (id) => {
  return {
    id,
    author: "Sun Tzu",
    name: "El arte de la guerra",
  };
};

server.get("/book/:id", {
  preHandler: async (request, reply) => {
    //  Con try catch podemos atrapar la excepciones generadas por peticiones asincronas
    try {
      //  Vamos a simular que obtenemos un token del header de la petición
      // Con ayuda de Postman u otra herramienta puedes enviar esta cabecera
      const { authorization } = request.headers;

      //  Usamos nuestra funcion de prueba para validar el token
      await validarToken(authorization);

      //  Esto es como si hicieramos un done()
      return;
    } catch (err) {
      //  Utilizamos el logger para guardar el error generado
      request.log.warn(err);

      //  De este lado le avisamos al usuario que no esta autorizado
      reply.code(401).send({
        error: "El usuario no esta autorizado",
      });
    }
  },
  handler: async (request, reply) => {
    //    Si el ciclo continua, vamos a obtener el resultado de la base de datos!
    const book = await obtenerDeBaseDeDatos(request.params.id);
    reply.send(book);
  },
});

server.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(0);
  }

  console.log("Fastify corriendo en el puerto 3000");
});
