module.exports = async (fastify, opts) => {
  fastify.get("/books", async (request, reply) => {
    const snapshot = await fastify.dbRef("books").once("value");

    reply.code(200).send(snapshot.val());
  });

  fastify.get(
    "/book/:key",
    {
      schema: {
        params: {
          type: "object",
          required: ["key"],
          properties: {
            key: { type: "string", minLength: 4 },
          },
        },
      },
    },
    async (request, reply) => {
      const key = request.params.key;

      const snapshot = await fastify.dbRef(`books/${key}`).once("value");

      reply.code(200).send(snapshot.val());
    }
  );

  fastify.post(
    "/book",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "author", "year", "synopsis"],
          properties: {
            name: { type: "string", minLength: 1 },
            author: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["name", "surname"],
                properties: {
                  name: { type: "string", minLength: 1 },
                  surname: { type: "string", minLength: 1 },
                },
              },
            },
            year: { type: "integer", minLength: 1 },
            synopsis: { type: "string", minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { name, author, year, synopsis } = request.body;
      const bookCreated = await fastify
        .dbRef("books")
        .push({ name, author, year, synopsis });

      reply.code(200).send({
        message: "Nuevo libro agregado",
        key: bookCreated.key,
      });
    }
  );

  fastify.put(
    "/book/:key",
    {
      schema: {
        params: {
          type: "object",
          required: ["key"],
          properties: {
            key: { type: "string", minLength: 4 },
          },
        },
        body: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string", minLength: 1 },
            author: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["name", "surname"],
                properties: {
                  name: { type: "string", minLength: 1 },
                  surname: { type: "string", minLength: 1 },
                },
              },
            },
            year: { type: "integer" },
            synopsis: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      const key = request.params.key;

      const snapshot = await fastify.dbRef(`books/${key}`).once("value");
      const value = snapshot.val();

      if (value) {
        const data = await fastify.dbRef(`books/${key}`).update({
          ...value,
          ...request.body,
        });

        reply.code(200).send({
          message: "El libro se ha actualizado",
          key,
          book: {
            ...value,
            ...request.body,
          },
        });
      } else {
        reply.code(400).send({
          message: "El libro no existe",
        });
      }
    }
  );

  fastify.delete(
    "/book/:key",
    {
      schema: {
        params: {
          type: "object",
          required: ["key"],
          properties: {
            key: { type: "string", minLength: 4 },
          },
        },
      },
    },
    async (request, reply) => {
      const key = request.params.key;

      const snapshot = await fastify.dbRef(`books/${key}`).once("value");
      const value = snapshot.val();

      if (value) {
        await fastify.dbRef(`books/${key}`).remove();
        reply.code(200).send({
          message: "El libro ha sido eliminado",
          key,
        });
      } else {
        reply.code(400).send({
          message: "Libro no valido",
        });
      }
    }
  );

  /*
    ERROR HANDLER
*/
  fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      request.log.info(
        `Context: ${error.validationContext}, errores: ${error.validation}`
      );

      reply.code(422).send({
        message: "Los campos no se enviaron correctamente",
        context: error.validationContext,
        error: error.validation,
      });
    }
  });
};
