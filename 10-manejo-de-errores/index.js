const fastify = require("fastify");

const server = fastify({
  logger: {
    level: "warn",
    prettyPrint: true,
  },
});

const enviarError = () =>
  new Promise((resolve, reject) => {
    reject("Esta promesa debe fallar");
  });

server.get(
  "/",
  {
    schema: {
      querystring: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
    },
  },
  (request, reply) => {
    enviarError().then(() => {
      reply.send({
        message: "Mi mensaje",
      });
    });
  }
);

server.setErrorHandler(function (error, request, reply) {
  if (error && error.validation) {
    request.log.info(
      `Context: ${error.validationContext}, errores: ${error.validation}`
    );

    reply.code(422).send({
      message: "Los campos no se enviaron correctamente",
      context: error.validationContext,
      error: error.validation,
    });
  } else {
    request.log.error(error);

    reply.code(500).send({
      message: "Error en el servidor",
    });
  }
});

server.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Fastify corriendo en puerto 3000");
});
