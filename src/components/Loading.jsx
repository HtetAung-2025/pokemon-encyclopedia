import './Loading.css';

function Loading({ message = "ポケモンを探しています..." }) {
    return (
        <div className="loading-container">
            <div className="pokeball-loader">
                <div className="pokeball-loader-inner"></div>
            </div>
            <p className="loading-text">{message}</p>
        </div>
    );
}

export default Loading;
