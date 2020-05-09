const fastify = require("fastify");
const path = require("path");

const server = fastify({
  logger: true,
});

server.register(require("fastify-static"), {
  root: path.resolve(__dirname, "public"),
  prefix: "/",
});

server.get("/", function (request, reply) {
  reply.sendFile("index.html");
});

server.setNotFoundHandler(function (request, reply) {
  if (
    request.headers["content-type"] &&
    request.headers["content-type"] === "application/json"
  ) {
    reply.code(404).send({
      message: "Ruta no encontrada",
    });
  } else {
    reply.code(404).sendFile("404.html");
  }
});

server.listen(3000, (err) => {
  if (err) process.exit(1);

  console.log("Fastify corriendo en puerto 3000");
});
