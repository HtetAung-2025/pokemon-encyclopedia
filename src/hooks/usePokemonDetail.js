import { useState, useEffect, useCallback } from 'react';
import { fetchPokemonDetail, fetchPokemonSpecies } from '../utils/api';

/**
 * Custom hook for fetching a single Pokemon's details
 * @param {string|number} idOrName - Pokemon ID or name
 * @returns {Object} Pokemon data, species data, loading state, error, and retry function
 */
export function usePokemonDetail(idOrName) {
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!idOrName) return;

        try {
            setLoading(true);
            setError(null);

            // Fetch both Pokemon details and species data in parallel
            const [pokemonData, speciesData] = await Promise.all([
                fetchPokemonDetail(idOrName),
                fetchPokemonSpecies(idOrName).catch(() => null), // Species might fail for some Pokemon
            ]);

            setPokemon(pokemonData);
            setSpecies(speciesData);
        } catch (err) {
            setError(err.message);
            setPokemon(null);
            setSpecies(null);
        } finally {
            setLoading(false);
        }
    }, [idOrName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const retry = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        pokemon,
        species,
        loading,
        error,
        retry,
    };
}

export default usePokemonDetail;
