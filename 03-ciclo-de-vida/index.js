const fastify = require("fastify");

const server = fastify({
  logger: {
    level: "info",
    prettyPrint: true,
  },
});

server.addHook("onRequest", function (request, reply, done) {
  request.log.info("Se ejecuta onRequest a nivel aplicación");
  done();
});

server.get("/", {
  onRequest: function (request, reply, done) {
    request.log.info("Se ejecuta onRequest");
    done();
  },
  preParsing: function (request, reply, done) {
    request.log.info("Se ejecuta preParsing");
    done();
  },
  preValidation: function (request, reply, done) {
    request.log.info("Se ejecuta preValidation");
    done();
  },
  preHandler: function (request, reply, done) {
    request.log.info("Se ejecuta preHandler");
    done();
  },
  handler: function (request, reply) {
    request.log.info("Se ejecuta handler");
    reply.code(200).send({
      message: "Fastify works!",
    });
  },
  preSerialization: function (request, reply, payload, done) {
    request.log.info("Se ejecuta preSerialization");
    done(null, payload);
  },
  onSend: function (request, reply, payload, done) {
    request.log.info("Se ejecuta onSend");
    done(null, payload);
  },
  onResponse: function (request, reply, done) {
    request.log.info("Se ejecuta onResponse");
    done();
  },
});

server.listen(3000, function (err) {
  if (err) {
    console.error(err);
    process.exit(0);
  }
});
