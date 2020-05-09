import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const CreateBook = () => {
  const [formData, setFormData] = useState({
    name: "",
    author: [
      {
        name: "",
        surname: "",
      },
    ],
    year: "",
    synopsis: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorData, setErrorData] = useState("");

  const postCreateBook = () => {
    if (status !== "loading") {
      setStatus("loading");
      setErrorData("");
      Axios.post("/api/v1/book", { ...formData })
        .then((response) => {
          setStatus("success");
        })
        .catch((err) => {
          console.error({ err });
          if (err && err.response && err.response.status === 422) {
            setStatus("error-validation");

            const errorValidations = err.response.data.error
              .map((errors) => {
                return `${errors.dataPath} ${errors.message}`;
              })
              .join(",");

            setErrorData(errorValidations);

            return;
          }

          setStatus("error");
        });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Crear libros</h1>
        <div className="flex justify-end">
          <Link to="/">
            <button
              type="button"
              className="text-sm bg-green-500 text-white rounded border border-green-600 py-1 px-2 mr-2"
            >
              Ver libros
            </button>
          </Link>
        </div>
      </div>

      <div className="p-2 bg-white rounded shadow mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postCreateBook();
          }}
        >
          <div className="flex flex-wrap">
            <div className="flex-1 flex flex-col pr-2">
              <label className="text-sm font-semibold py-2">
                Nombre del libro
              </label>
              <input
                type="text"
                className="h-8 p-1 bg-gray-100 bg-gray-200 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-semibold py-2">
                Año de publicación
              </label>
              <input
                type="text"
                className="h-8 p-1 bg-gray-100 bg-gray-200 rounded"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center">
            <h3 className="text-base font-semibold py-2 mr-2">Autor</h3>
            <button
              type="button"
              className="text-white text-sm rounded bg-green-500 py-1 px-2"
              onClick={() => {
                const authorArray = formData.author;
                authorArray.push({
                  name: "",
                  surname: "",
                });

                setFormData({
                  ...formData,
                  author: authorArray,
                });
              }}
            >
              Agregar
            </button>
          </div>
          {formData.author.map((authorBlock, index) => (
            <div key={index} className="flex flex-wrap items-center">
              <label className="text-sm font-semibold py-2 mr-2">
                Nombre(s)
              </label>
              <input
                type="text"
                className="h-8 p-1 bg-gray-100 bg-gray-200 rounded flex-1"
                value={authorBlock.name}
                onChange={(e) => {
                  const authorArray = formData.author;
                  authorArray[index].name = e.target.value;
                  setFormData({
                    ...formData,
                    author: authorArray,
                  });
                }}
              />
              <label className="text-sm font-semibold py-2 mx-2">
                Apellido(s)
              </label>
              <input
                type="text"
                className="h-8 p-1 bg-gray-100 bg-gray-200 rounded flex-1"
                value={authorBlock.surname}
                onChange={(e) => {
                  const authorArray = formData.author;
                  authorArray[index].surname = e.target.value;
                  setFormData({
                    ...formData,
                    author: authorArray,
                  });
                }}
              />
              {index !== 0 && (
                <button
                  type="button"
                  className="bg-red-500 bg-red-600 text-white text-sm py-1 px-3 rounded ml-2"
                  onClick={() => {
                    const authorArray = formData.author;

                    authorArray.pop();

                    setFormData({
                      ...formData,
                      author: authorArray,
                    });
                  }}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-sm font-semibold py-2">Sinopsis</label>
            <textarea
              className="p-1 bg-gray-100 bg-gray-200 rounded"
              rows="4"
              value={formData.synopsis}
              onChange={(e) =>
                setFormData({ ...formData, synopsis: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="py-2 mt-4 text-sm px-4 bg-green-500 rounded text-white block w-1/3 mx-auto"
          >
            Enviar
          </button>
        </form>
        <div className="mt-2">
          {status === "loading" && <p>Guardando libro</p>}
          {status === "success" && (
            <p className="bg-green-200 text-green-800 p-2 border border-green-300 rounded">
              El libro se ha guardado con éxito
            </p>
          )}
          {status === "error" && (
            <p className="bg-red-200 text-red-800 p-2 border border-red-300 rounded">
              Error al guardar libro
            </p>
          )}
          {status === "error-validation" && (
            <p className="bg-red-200 text-red-800 p-2 border border-red-300 rounded">
              Error en los datos enviados: {errorData}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBook;
