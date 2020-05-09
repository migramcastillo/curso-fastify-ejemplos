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
  },
  preHandler: (request, reply, done) => {
    const { release } = request.body;

    const releaseDate = new Date(release);

    /*
     *   En esta validacion custom, vamos a hacer que la fecha sea un objeto Date
     *   de Javascript menor a la fecha actual y que sea válido
     *   Por ejemplo, la fecha 2010/04/27 pasaría la validación
     */

    if (isNaN(releaseDate) || releaseDate === "Invalid Date") {
      reply.code(400).send({
        error: "La fecha no es valida",
      });
    } else if (releaseDate > new Date()) {
      reply.code(400).send({
        error: "La fecha es posterior a la fecha actual",
      });
    } else {
      done();
    }
  },
  handler: (request, reply) => {
    const { name, author, release } = request.body;
    reply.send({
      name: `El libro se llama ${name}`,
      author: `El autor se llama ${author}`,
      release: `Fue publicado en la fecha ${release}`,
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
