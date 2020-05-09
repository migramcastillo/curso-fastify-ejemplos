const fastify = require("fastify");
const server = fastify({
  logger: {
    level: "warn",
    prettyPrint: true,
  },
});

server.post("/book", {
  schema: {
    body: {
      type: "object",
      required: ["name", "author", "release"],
      properties: {
        name: { type: "string" },
        author: { type: "string" },
        release: { type: "string" },
      },
    },
    //  Schema de response
    response: {
      //  Definimos schema para respuestas 200
      200: {
        type: "object",
        properties: {
          name: { type: "string" },
          author: { type: "string" },
        },
      },
    },
  },
  handler: (request, reply) => {
    const { name, author, release } = request.body;
    reply.send({
      name: `El libro se llama ${name}`,
      author: `El autor se llama ${author}`,
      // Estos campos no se verá reflejado en la respuesta por la serialization
      release: `Fue publicado en la fecha ${release}`,
      editorial: "Editorial desconocida",
    });
  },
});

server.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(0);
  }

  console.log("Fastify corriendo en el puerto 3000");
});
