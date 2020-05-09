const buildServer = require("../12-aplicacion/server");

const buildTestServer = async (tap) => {
  const server = buildServer();

  server.get("/error", async (request, reply) => {
    throw new Error("Error provocado");
  });

  tap.tearDown(() => {
    server.close();
  });

  return server;
};

module.exports = buildTestServer;
