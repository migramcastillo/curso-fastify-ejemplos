const buildServer = require("./server");

const server = buildServer({
  logger: {
    level: "info",
    prettyPrint: true,
  },
});

server.listen(3000, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log("Fastify corriendo en puerto 3000");
});
