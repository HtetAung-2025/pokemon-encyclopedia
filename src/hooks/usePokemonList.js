import { useState, useEffect, useCallback } from 'react';
import { fetchPokemonList, fetchMultiplePokemon, extractPokemonId } from '../utils/api';

/**
 * Custom hook for fetching Pokemon list with pagination
 * @param {number} limit - Number of Pokemon per page
 * @returns {Object} Pokemon data, loading state, error, and pagination controls
 */
export function usePokemonList(limit = 20) {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchPokemon = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const offset = page * limit;
            const listData = await fetchPokemonList(limit, offset);

            setTotalCount(listData.count);
            setHasMore(listData.next !== null);

            // Fetch detailed data for each Pokemon
            const detailedPokemon = await fetchMultiplePokemon(
                listData.results.map(p => p.url)
            );

            setPokemon(detailedPokemon);
        } catch (err) {
            setError(err.message);
            setPokemon([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    const nextPage = useCallback(() => {
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    }, [hasMore]);

    const prevPage = useCallback(() => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    }, [page]);

    const goToPage = useCallback((pageNum) => {
        const maxPage = Math.ceil(totalCount / limit) - 1;
        if (pageNum >= 0 && pageNum <= maxPage) {
            setPage(pageNum);
        }
    }, [totalCount, limit]);

    const retry = useCallback(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    return {
        pokemon,
        loading,
        error,
        page,
        totalCount,
        hasMore,
        hasPrev: page > 0,
        totalPages: Math.ceil(totalCount / limit),
        nextPage,
        prevPage,
        goToPage,
        retry,
    };
}

export default usePokemonList;
