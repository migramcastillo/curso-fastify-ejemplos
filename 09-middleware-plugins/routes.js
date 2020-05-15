async function myRoutes(fastify, options) {
  //  Este decorator y hook sólo afectará a las rutas en este archivo o mejor dicho en este contexto
  fastify.decorateRequest("token", "");

  const validateToken = (token) =>
    new Promise((resolve, reject) => {
      if (token) {
        resolve();
      } else {
        reject();
      }
    });

  fastify.addHook("preHandler", async (request, reply) => {
    try {
      const token = request.headers["authorization"];

      await validateToken(token);
      request.token = token;
      return;
    } catch (err) {
      reply.code(401).send({
        message: "No autorizado",
      });
    }
  });

  fastify.get("/", (request, reply) => {
    reply.send({
      message: "Fastify works",
      token: request.token,
    });
  });

  fastify.get("/books", (request, reply) => {
    //  Vamos a guardar todos nuestros libros en una variable
    const books = [
      "El laberinto de la soledad",
      "Rebelión en la granja",
      "100 años de soledad",
    ];

    //  Obtenemos el string de filtro que vamos a aplicar
    const { filtro } = request.query;

    //  Esta linea filtra los libros por aquellos cuyo nombre coincida con el filtro enviado
    const filteredBooks = books.filter((book) => book.includes(filtro));

    //  Retornamos los libros filtrados
    reply.send(filteredBooks);
  });

  fastify.get("/book/:id", (request, reply) => {
    //  Sinónimo de const id = request.params.id;
    const { id } = request.params;

    reply.send({
      message: `Estas buscando el libro ${id}`,
    });
  });

  fastify.post("/book", (request, reply) => {
    //  Obtenemos los datos de nombre y autor del libro
    const { name, author } = request.body;

    reply.send({
      name: `El libro se llama ${name}`,
      author: `El autor se llama ${author}`,
    });
  });

  fastify.put("/book/:id", (request, reply) => {
    const { id } = request.params;

    //  Obtenemos los datos de nombre y autor del libro
    const { name, author } = request.body;

    reply.send({
      message: `El registro con id ${id} será actualizado`,
      name: `El libro ahora se llama ${name}`,
      author: `El autor ahora se llama ${author}`,
    });
  });

  fastify.delete("/book/:id", (request, reply) => {
    const { id } = request.params;

    //  Si necesitas datos adicionales puedes utilizar query
    // const { other } = request.query;

    reply.send({
      message: `Se elimanará el libro con id ${id}`,
    });
  });
}

module.exports = myRoutes;
