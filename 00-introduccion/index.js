const fastify = require("fastify");

const server = fastify();

server.get("/", function (request, reply) {
  reply.send({
    message: "Fastify works",
  });
});

server.listen(3000, function (error) {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log("Fastify corriendo en el puerto 3000");
});
