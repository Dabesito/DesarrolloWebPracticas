import { useEffect, useState } from "react";

// 👇 AQUÍ PUSE TU CLAVE REAL (basada en tus capturas anteriores)
export const API_KEY = "48447a8b"; 

/**
 * Hook personalizado para obtener películas desde la API de OMDb.
 */
export function useFetchMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si la búsqueda tiene menos de 3 caracteres, limpiar resultados y error
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(null);

        // 👇 CAMBIÉ http POR https PARA EVITAR ERRORES DE SEGURIDAD
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );

        if (!response.ok) throw new Error("Error al cargar películas");

        const data = await response.json();

        if (data.Response === "False")
          throw new Error("No se encontraron resultados");

        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [query]);

  return { movies, isLoading, error };
}
