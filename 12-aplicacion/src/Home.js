import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState({});
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (status === "loading") {
      Axios.get("/api/v1/books")
        .then((result) => {
          const { data } = result;
          setBooks(data);
          console.log(Object.keys(data));
          setStatus("success");
        })
        .catch((err) => {
          setStatus("fail");
        });
    }
  }, [status]);

  const deleteBook = (id) => {
    Axios.delete(`/api/v1/book/${id}`)
      .then((response) => {
        setStatus("loading");
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Listado de libros
        </h1>
        <div className="flex justify-end">
          <Link to="/create-book">
            <button
              type="button"
              className="text-sm bg-green-500 text-white rounded border border-green-600 py-1 px-2 mr-2"
            >
              Agregar libro
            </button>
          </Link>

          <button
            type="button"
            className="text-sm bg-blue-500 text-white rounded border border-blue-600 py-1 px-2"
            onClick={() => setStatus("loading")}
          >
            Actualizar
          </button>
        </div>
      </div>

      {status === "loading" && <p>Cargando...</p>}
      {status === "empty" && <p>No hay libros en tu DB</p>}
      {status === "success" && (
        <div className="flex flex-wrap">
          {Object.keys(books).map((key) => (
            <div key={key} className="py-2 pr-2 w-1/3">
              <div className="shadow p-2 rounded bg-white">
                <h2 className="font-semibold text-gray-900 text-xl">
                  {books[key].name}
                </h2>
                <small className="text-gray-700 text-sm">
                  Año de publicación: {books[key].year}
                </small>
                <h3 className="text-base font-semibold text-gray-800 py-2">
                  Autor:{" "}
                  {books[key].author.map((author, index) => {
                    return `${index > 0 ? ", " : ""}${author.name} ${
                      author.surname
                    }`;
                  })}
                </h3>
                <p className="text-gray-700 py-2 text-sm">
                  {books[key].synopsis}
                </p>
                <div className="flex justify-end pt-2">
                  <Link to={`/edit-book/${key}`}>
                    <button
                      type="button"
                      className="text-sm bg-blue-500 text-white rounded border border-blue-600 py-1 px-2 mr-1"
                    >
                      Editar
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="text-sm bg-red-500 text-white rounded border border-red-600 py-1 px-2"
                    onClick={() => {
                      deleteBook(key);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
