const fastify = require("fastify");

const server = fastify();

server.get("/", function (request, reply) {
  reply.send({
    message: "Fastify works",
  });
});

server.get("/books", function (request, reply) {
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

server.get("/book/:id", function (request, reply) {
  //  Sinónimo de const id = request.params.id;
  const { id } = request.params;

  reply.send({
    message: `Estas buscando el libro ${id}`,
  });
});

server.post("/book", function (request, reply) {
  //  Obtenemos los datos de nombre y autor del libro
  const { name, author } = request.body;

  reply.send({
    name: `El libro se llama ${name}`,
    author: `El autor se llama ${author}`,
  });
});

server.put("/book/:id", function (request, reply) {
  const { id } = request.params;

  //  Obtenemos los datos de nombre y autor del libro
  const { name, author } = request.body;

  reply.send({
    message: `El registro con id ${id} será actualizado`,
    name: `El libro ahora se llama ${name}`,
    author: `El autor ahora se llama ${author}`,
  });
});

server.delete("/book/:id", function (request, reply) {
  const { id } = request.params;

  //  Si necesitas datos adicionales puedes utilizar query
  // const { other } = request.query;

  reply.send({
    message: `Se elimanará el libro con id ${id}`,
  });
});

server.listen(3000, function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Fastify corriendo en el puerto 3000");
});
