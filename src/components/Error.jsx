import './Error.css';

function Error({
    title = "エラーが発生しました",
    message = "データの取得に失敗しました。もう一度お試しください。",
    onRetry
}) {
    return (
        <div className="error-container">
            <div className="error-icon">😢</div>
            <h2 className="error-title">{title}</h2>
            <p className="error-message">{message}</p>
            {onRetry && (
                <button className="error-button" onClick={onRetry}>
                    <span className="error-button-icon">🔄</span>
                    再試行
                </button>
            )}
        </div>
    );
}

export default Error;
