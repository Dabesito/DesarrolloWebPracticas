import { useEffect, useState } from "react";
import StarRating from "./StarRating"; // Asegúrate de que este archivo exista
import { API_KEY } from "../hooks/useFetchMovies"; // Importamos tu clave del otro archivo

export function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [error, setError] = useState(""); // Estado para guardar errores

  // Verificamos si la película ya está en la lista de vistas
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // Destructuramos los datos de la película para usarlos más fácil
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  /* EFECTO 1: Cargar los detalles de la película 
     Aquí es donde probablemente tenías el error de "película is not defined"
  */
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        setError(""); // Limpiamos errores previos

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );

        if (!res.ok) throw new Error("Error al cargar los detalles");

        const data = await res.json();
        
        // Guardamos los datos en el estado 'movie' (NO 'película')
        setMovie(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message); // Si falla, mostramos el mensaje
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  /* EFECTO 2: Cambiar el título de la pestaña del navegador */
  useEffect(() => {
    if (!title) return;
    document.title = `Película | ${title}`;

    return function () {
      document.title = "Palomitas de papel";
    };
  }, [title]);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // Manejo de tecla "Escape" para cerrar
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);

  return (
    <div className="details">
      {isLoading ? (
        <p className="loader">Cargando...</p>
      ) : error ? (
        <p className="error">⛔ {error}</p>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster de ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Agregar a la lista
                    </button>
                  )}
                </>
              ) : (
                <p>
                  Has calificado esta película con {watchedUserRating} <span>🌟</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Elenco: {actors}</p>
            <p>Director: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}