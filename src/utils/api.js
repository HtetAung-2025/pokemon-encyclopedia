const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Pokemon API utility functions
 */

/**
 * Fetches a list of Pokemon with pagination
 * @param {number} limit - Number of Pokemon to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Pokemon list with count and results
 */
export async function fetchPokemonList(limit = 20, offset = 0) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetches detailed information for a single Pokemon
 * @param {string|number} idOrName - Pokemon ID or name
 * @returns {Promise<Object>} Pokemon details
 */
export async function fetchPokemonDetail(idOrName) {
    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Pokemon not found: ${idOrName}`);
        }
        throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetches Pokemon species data (for Japanese names and descriptions)
 * @param {string|number} idOrName - Pokemon ID or name
 * @returns {Promise<Object>} Pokemon species data
 */
export async function fetchPokemonSpecies(idOrName) {
    const response = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon species: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetches multiple Pokemon details in parallel
 * @param {Array<string>} urls - Array of Pokemon URLs
 * @returns {Promise<Array<Object>>} Array of Pokemon details
 */
export async function fetchMultiplePokemon(urls) {
    const promises = urls.map(url => fetch(url).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
        return res.json();
    }));

    return Promise.all(promises);
}

/**
 * Searches Pokemon by name (partial match)
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array<Object>>} Matching Pokemon
 */
export async function searchPokemon(query, limit = 1000) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Failed to search Pokemon: ${response.status}`);
    }

    const data = await response.json();
    const normalizedQuery = query.toLowerCase().trim();

    return data.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(normalizedQuery)
    );
}

/**
 * Gets the sprite URL for a Pokemon
 * @param {number} id - Pokemon ID
 * @returns {string} Sprite URL
 */
export function getPokemonSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Gets the animated sprite URL for a Pokemon
 * @param {number} id - Pokemon ID
 * @returns {string} Animated sprite URL
 */
export function getPokemonAnimatedSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
}

/**
 * Extracts Pokemon ID from URL
 * @param {string} url - Pokemon URL
 * @returns {number} Pokemon ID
 */
export function extractPokemonId(url) {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : null;
}

/**
 * Formats Pokemon ID to display format (e.g., #001)
 * @param {number} id - Pokemon ID
 * @returns {string} Formatted ID
 */
export function formatPokemonId(id) {
    return `#${String(id).padStart(3, '0')}`;
}

/**
 * Converts height from decimeters to meters
 * @param {number} height - Height in decimeters
 * @returns {string} Height in meters
 */
export function formatHeight(height) {
    return `${(height / 10).toFixed(1)} m`;
}

/**
 * Converts weight from hectograms to kilograms
 * @param {number} weight - Weight in hectograms
 * @returns {string} Weight in kilograms
 */
export function formatWeight(weight) {
    return `${(weight / 10).toFixed(1)} kg`;
}

/**
 * Gets Japanese name from species data
 * @param {Object} species - Pokemon species data
 * @returns {string|null} Japanese name or null
 */
export function getJapaneseName(species) {
    if (!species?.names) return null;
    const jaName = species.names.find(name => name.language.name === 'ja-Hrkt');
    return jaName?.name || null;
}

/**
 * Gets Japanese flavor text from species data
 * @param {Object} species - Pokemon species data
 * @returns {string|null} Japanese description or null
 */
export function getJapaneseFlavorText(species) {
    if (!species?.flavor_text_entries) return null;
    const jaText = species.flavor_text_entries.find(
        entry => entry.language.name === 'ja'
    );
    return jaText?.flavor_text?.replace(/\n|\f/g, ' ') || null;
}

/**
 * Gets English flavor text from species data
 * @param {Object} species - Pokemon species data
 * @returns {string|null} English description or null
 */
export function getEnglishFlavorText(species) {
    if (!species?.flavor_text_entries) return null;
    const enText = species.flavor_text_entries.find(
        entry => entry.language.name === 'en'
    );
    return enText?.flavor_text?.replace(/\n|\f/g, ' ') || null;
}

/**
 * Type color mapping
 */
export const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

/**
 * Type name translations (English to Japanese)
 */
export const typeTranslations = {
    normal: 'ノーマル',
    fire: 'ほのお',
    water: 'みず',
    electric: 'でんき',
    grass: 'くさ',
    ice: 'こおり',
    fighting: 'かくとう',
    poison: 'どく',
    ground: 'じめん',
    flying: 'ひこう',
    psychic: 'エスパー',
    bug: 'むし',
    rock: 'いわ',
    ghost: 'ゴースト',
    dragon: 'ドラゴン',
    dark: 'あく',
    steel: 'はがね',
    fairy: 'フェアリー',
};

/**
 * Stat name translations
 */
export const statTranslations = {
    hp: 'HP',
    attack: 'こうげき',
    defense: 'ぼうぎょ',
    'special-attack': 'とくこう',
    'special-defense': 'とくぼう',
    speed: 'すばやさ',
};
