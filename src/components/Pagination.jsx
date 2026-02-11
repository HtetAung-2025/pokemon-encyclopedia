import './Pagination.css';

function Pagination({
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    onGoToPage,
    hasPrev,
    hasNext
}) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages - 1, start + maxVisible - 1);

        // Adjust start if we're near the end
        if (end - start < maxVisible - 1) {
            start = Math.max(0, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            <button
                className="pagination-btn pagination-arrow"
                onClick={onPrevPage}
                disabled={!hasPrev}
                aria-label="前のページ"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="pagination-arrow-text">前へ</span>
            </button>

            <div className="pagination-pages">
                {pageNumbers[0] > 0 && (
                    <>
                        <button
                            className="pagination-btn pagination-number"
                            onClick={() => onGoToPage(0)}
                        >
                            1
                        </button>
                        {pageNumbers[0] > 1 && (
                            <span className="pagination-ellipsis">...</span>
                        )}
                    </>
                )}

                {pageNumbers.map(page => (
                    <button
                        key={page}
                        className={`pagination-btn pagination-number ${page === currentPage ? 'active' : ''}`}
                        onClick={() => onGoToPage(page)}
                    >
                        {page + 1}
                    </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
                            <span className="pagination-ellipsis">...</span>
                        )}
                        <button
                            className="pagination-btn pagination-number"
                            onClick={() => onGoToPage(totalPages - 1)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            <button
                className="pagination-btn pagination-arrow"
                onClick={onNextPage}
                disabled={!hasNext}
                aria-label="次のページ"
            >
                <span className="pagination-arrow-text">次へ</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>
        </div>
    );
}

export default Pagination;
