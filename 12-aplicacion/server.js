const fastify = require("fastify");
const path = require("path");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase.json");

const buildServer = (options) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });

  const db = admin.database();

  const ref = db.ref("/");

  const server = fastify(options);

  server.register(require("fastify-cors"), {
    origin: true,
  });

  server.register(require("fastify-static"), {
    root: path.resolve(__dirname, "build"),
    prefix: "/",
  });

  server.decorate("dbRef", (name) => ref.child(name));

  server.get("/", (request, reply) => {
    reply.sendFile("index.html");
  });

  server.register(require("./routes"), {
    prefix: "/api/v1",
  });

  server.addHook("onClose", (fastify, done) => {
    admin
      .app()
      .delete()
      .then(() => done());
  });

  return server;
};

module.exports = buildServer;
