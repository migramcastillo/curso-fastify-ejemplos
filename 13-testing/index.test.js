const tap = require("tap");
const buildTestServer = require("./helper");

tap.test("Fastify Firebase API", async (subtest) => {
  const server = await buildTestServer(tap);
  let bookKey = "";
  let bookData = {};

  subtest.test("Crear Libro", async (t) => {
    t.plan(5);

    const response = await server.inject({
      method: "POST",
      url: "/api/v1/book",
      payload: {
        name: "La brújula dorada",
        author: [
          {
            name: "Philip",
            surname: "Pullman",
          },
        ],
        year: 2003,
        synopsis:
          "Las aventuras de Lyra en un mundo donde los clanes de brujas y osos polares armados gobiernan.",
      },
    });

    t.equal(response.statusCode, 200, "Respuesta debe ser 200");
    const body = response.json();
    t.ok(body.message, "Se debe enviar un message");
    t.ok(body.key, "Se debe enviar la key generada");
    t.type(body.message, "string", "message debe ser string");
    t.type(body.key, "string", "key debe ser string");
    bookKey = body.key;
  });

  subtest.test("Crear libro con schema inválido", async (t) => {
    t.plan(1);

    const response = await server.inject({
      method: "POST",
      url: "/api/v1/book",
      payload: {
        name: "La brújula dorada",
        author: ["Philip Pullman"],
        year: 2003,
        synopsis:
          "Las aventuras de Lyra en un mundo donde los clanes de brujas y osos polares armados gobiernan.",
      },
    });

    t.equal(response.statusCode, 422, "Respuesta debe ser 422");
  });

  subtest.test("Obtener libros", async (t) => {
    t.plan(2);

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/books",
    });

    t.equal(response.statusCode, 200, "Respuesta debe ser 200");
    const booksLength = Object.keys(response.json()).length;
    t.equal(booksLength > 0, true, "Debe contener al menos un libro");
  });

  subtest.test("Obtener libro por key", async (t) => {
    t.plan(5);

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/book/${bookKey}`,
    });

    t.equal(response.statusCode, 200, "Respuesta debe ser 200");
    const body = response.json();
    t.ok(body.name, "Debe retornar un nombre");
    t.ok(body.author, "Debe retornar un author");
    t.ok(body.year, "Debe retornar un año");
    t.ok(body.synopsis, "Debe retornar una sinposis");
    bookData = body;
  });

  subtest.test("Actualizar libro por key", async (t) => {
    t.plan(6);

    const responsePut = await server.inject({
      method: "PUT",
      url: `/api/v1/book/${bookKey}`,
      payload: {
        name: "The Golden Compass",
      },
    });

    t.equal(responsePut.statusCode, 200, "Respuesta PUT debe ser 200");

    const responseGet = await server.inject({
      method: "GET",
      url: `/api/v1/book/${bookKey}`,
    });

    t.equal(responseGet.statusCode, 200, "Respuesta GET debe ser 200");
    const body = responseGet.json();

    t.equal(
      body.name,
      "The Golden Compass",
      "Debe retornar el nuevo nombre de libro"
    );
    t.deepEqual(body.author, bookData.author, "Debe retornar el mismo author");
    t.equal(body.year, bookData.year, "Debe retornar el mismo año");
    t.equal(
      body.synopsis,
      bookData.synopsis,
      "Debe retornar la misma sinopsis"
    );
  });

  subtest.test("Actualizar libro por key con esquema invalido", async (t) => {
    t.plan(1);

    const responsePut = await server.inject({
      method: "PUT",
      url: `/api/v1/book/${bookKey}`,
      payload: {
        name: "",
      },
    });

    t.equal(responsePut.statusCode, 422, "Respuesta PUT debe ser 422");
  });

  subtest.test("Eliminar libro por key", async (t) => {
    t.plan(3);

    const responseDel = await server.inject({
      method: "DELETE",
      url: `/api/v1/book/${bookKey}`,
    });

    t.equal(responseDel.statusCode, 200, "Respuesta DELETE debe ser 200");

    const responseGet = await server.inject({
      method: "GET",
      url: `/api/v1/book/${bookKey}`,
    });

    t.equal(responseGet.statusCode, 200, "Respuesta GET debe ser 200");
    const body = responseGet.json();
    t.equal(body, null, "Respuesta debe ser nula");
  });

  subtest.test("Eliminar libro por key error", async (t) => {
    t.plan(1);

    const responseDel = await server.inject({
      method: "DELETE",
      url: `/api/v1/book/${bookKey}`,
    });

    t.equal(
      responseDel.statusCode,
      400,
      "Respuesta DELETE debe ser 400 para key que no existe"
    );
  });

  subtest.test("Obtener ruta raíz", async (t) => {
    t.plan(2);

    const response = await server.inject({
      method: "GET",
      url: `/`,
    });

    t.equal(response.statusCode, 200, "Respuesta / debe ser 200");
    t.equal(
      response.headers["content-type"],
      "text/html; charset=UTF-8",
      "Respuesta debe ser texto html con UTF 8"
    );
  });

  subtest.test("Error 500", async (t) => {
    t.plan(1);

    const response = await server.inject({
      method: "GET",
      url: `/error`,
    });

    t.equal(response.statusCode, 500, "Respuesta debe ser 500");
  });
});
