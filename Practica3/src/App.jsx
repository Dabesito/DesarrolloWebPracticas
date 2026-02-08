import { useState, useEffect } from "react"; // 🆕 Agregamos useEffect
import { Logo, Nav, NumResults, Search } from "./components/nav";
import { Box } from "./components/Box";
import { MovieList } from "./components/Movie";
import {
  WatchedMoviesContainer,
  WatchedMoviesList,
  WatchedSummary,
} from "./components/WatchedMovie";
import { useFetchMovies } from "./hooks/useFetchMovies";
import { MovieDetails } from "./components/MovieDetails";

export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useFetchMovies(query);

  // 🆕 1. INICIALIZAR EL ESTADO LEYENDO DEL LOCALSTORAGE
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  const [selectedId, setSelectedId] = useState(null);

  // 🆕 2. GUARDAR EN LOCALSTORAGE CADA VEZ QUE CAMBIA LA LISTA 'WATCHED'
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  function handleSelectMovie(id) {
    setSelectedId((curId) => (id === curId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage se encarga solo gracias al useEffect de arriba
  }

  // 🆕 3. FUNCIÓN PARA ELIMINAR PELÍCULA
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>

      <main className="main">
        <Box>
          {isLoading && <p className="loader">Cargando...</p>}
          {error && <p className="error">⛔ {error}</p>}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box>
          <WatchedMoviesContainer>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                {/* 🆕 4. PASAMOS LA FUNCIÓN DE ELIMINAR AL COMPONENTE */}
                <WatchedMoviesList 
                  watched={watched} 
                  onDeleteWatched={handleDeleteWatched} 
                />
              </>
            )}
          </WatchedMoviesContainer>
        </Box>
      </main>
    </>
  );
}