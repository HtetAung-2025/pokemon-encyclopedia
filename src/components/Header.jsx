import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <div className="pokeball">
                            <div className="pokeball-top"></div>
                            <div className="pokeball-center"></div>
                            <div className="pokeball-bottom"></div>
                        </div>
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">ポケモン図鑑</span>
                        <span className="logo-subtitle">Pokemon Encyclopedia</span>
                    </div>
                </Link>

                <nav className="nav">
                    <a
                        href="https://pokeapi.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        <span className="nav-link-icon">📚</span>
                        PokeAPI
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
