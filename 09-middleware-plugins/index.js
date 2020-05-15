const fastify = require("fastify");
const server = fastify();

//  Registramos nuestros plugins

// Plugin de cookies con un secret basico para cifrar las cookies
server.register(require("fastify-cookie"), {
  secret: "mysecret",
  parseOptions: {},
});

//  Helmet para eliminar cabeceras inseguras
server.register(require("fastify-helmet"));

//  Con esta configuración de CORS podemos recibir solicitudes de cualquier dominio
//  Para los metodos GET, PUT, POST y DELETE en nuestra APIRest
server.register(require("fastify-cors"), {
  methods: ["GET", "PUT", "POST", "DELETE"],
  origin: false,
});

//  Ahora nuestras rutas son un plugin!
server.register(require("./routes.js"), { prefix: "/api" });

server.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Fastify corriendo en el puerto 3000");
});
