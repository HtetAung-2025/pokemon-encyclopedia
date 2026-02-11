import { Link } from 'react-router-dom';
import { formatPokemonId, getPokemonSpriteUrl, typeColors, typeTranslations } from '../utils/api';
import './PokemonCard.css';

function PokemonCard({ pokemon }) {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    const typeColor = typeColors[mainType] || typeColors.normal;

    return (
        <Link
            to={`/pokemon/${pokemon.id}`}
            className="pokemon-card"
            style={{ '--type-color': typeColor }}
        >
            <div className="card-background">
                <div className="card-circle"></div>
            </div>

            <div className="card-header">
                <span className="pokemon-id">{formatPokemonId(pokemon.id)}</span>
            </div>

            <div className="card-image-container">
                <img
                    src={getPokemonSpriteUrl(pokemon.id)}
                    alt={pokemon.name}
                    className="pokemon-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = pokemon.sprites?.front_default || '';
                    }}
                />
            </div>

            <div className="card-content">
                <h3 className="pokemon-name">{pokemon.name}</h3>

                <div className="pokemon-types">
                    {pokemon.types.map(({ type }) => (
                        <span
                            key={type.name}
                            className="type-badge"
                            style={{ backgroundColor: typeColors[type.name] }}
                        >
                            {typeTranslations[type.name] || type.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

export default PokemonCard;
