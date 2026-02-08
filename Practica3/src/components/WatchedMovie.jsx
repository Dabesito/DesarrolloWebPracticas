export function WatchedMoviesContainer({ children }) {
  return <>{children}</>;
}

// 👇 1. Recibimos la función onDeleteWatched aquí
export function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched} // 👇 2. Se la pasamos a cada película individual
        />
      ))}
    </ul>
  );
}

// 👇 3. Recibimos la función aquí también
export function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        {/* 👇 4. Hacemos que el botón funcione al hacer click */}
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

/**
 * Calcula el promedio de un arreglo de números.
 */
const calculateAverage = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;

export function WatchedSummary({ watched }) {
  const avgImdbRating = calculateAverage(
    watched.map((movie) => movie.imdbRating)
  );
  const avgUserRating = calculateAverage(
    watched.map((movie) => movie.userRating)
  );
  const avgRuntime = calculateAverage(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Películas que has visto</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} películas</span>
        </p>
        <p>
          <span>⭐</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
