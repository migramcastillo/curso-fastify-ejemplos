const fastify = require("fastify");

const server = fastify({
  logger: true,
});

//  Nuestra ruta de prueba
server.get("/", function (request, reply) {
  reply.send({
    message: "Fastify works",
  });
});

server.listen(3000, function (err) {
  if (err) {
    console.error(err);
    process.exit(0);
  }
});
