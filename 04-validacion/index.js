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
      required: ["name", "author"],
      properties: {
        name: { type: "string" },
        author: { type: "string" },
      },
    },
  },
  handler: function (request, reply) {
    const { name, author } = request.body;
    reply.send({
      name: `El libro se llama ${name}`,
      author: `El autor se llama ${author}`,
    });
  },
});

server.listen(3000, function (err) {
  if (err) {
    console.error(err);
    process.exit(0);
  }

  console.log("Fastify corriendo en el puerto 3000");
});
