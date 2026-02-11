import { useState, useEffect, useCallback, useRef } from 'react';
import { searchPokemon, fetchMultiplePokemon } from '../utils/api';

/**
 * Custom hook for searching Pokemon with debounce
 * @param {string} query - Search query
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} Search results, loading state, error, and control functions
 */
export function usePokemonSearch(query, debounceMs = 300) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const abortControllerRef = useRef(null);

    // Debounce the query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    // Perform the search
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                setError(null);
                return;
            }

            // Abort previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            try {
                setLoading(true);
                setError(null);

                const matchingPokemon = await searchPokemon(debouncedQuery);

                // Limit to first 20 results for performance
                const limitedResults = matchingPokemon.slice(0, 20);

                // Fetch detailed data for matched Pokemon
                const detailedPokemon = await fetchMultiplePokemon(
                    limitedResults.map(p => p.url)
                );

                setResults(detailedPokemon);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        };

        performSearch();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [debouncedQuery]);

    const clearSearch = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    return {
        results,
        loading,
        error,
        isSearching: debouncedQuery.trim().length > 0,
        clearSearch,
    };
}

export default usePokemonSearch;
