import { useState } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './Home.css';

function Home() {
    // ===== インポート部分 =====
    const [searchQuery, setSearchQuery] = useState('');// useState: 検索クエリの状態管理用
    const pokemonList = usePokemonList(20);//usePokemonList: ポケモン一覧を取得するカスタムフック
    const searchResults = usePokemonSearch(searchQuery);//usePokemonSearch: 検索機能のカスタムフック

    // ===== 状態管理 =====
    const isSearching = searchQuery.trim().length > 0;//searchQuery: 検索バーの入力値を保持
    const pokemon = isSearching ? searchResults.results : pokemonList.pokemon;//pokemonList: 20匹ずつポケモンを取得（ページネーション付き）
    const loading = isSearching ? searchResults.loading : pokemonList.loading;//searchResults: 検索結果を取得
    const error = isSearching ? searchResults.error : pokemonList.error;

    return (
        <div className="home">
            <div className="container">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="hero-title-main">ポケモン図鑑</span>
                            <span className="hero-title-sub">Pokemon Encyclopedia</span>
                        </h1>
                        <p className="hero-description">
                            すべてのポケモンの情報を検索・閲覧できます。
                            <br />
                            お気に入りのポケモンを見つけましょう！
                        </p>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-value">{pokemonList.totalCount || '1000+'}</span>
                                <span className="hero-stat-label">ポケモン</span>
                            </div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">18</span>
                                <span className="hero-stat-label">タイプ</span>
                            </div>
                            <div className="hero-stat">
                                <span className="hero-stat-value">9</span>
                                <span className="hero-stat-label">世代</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-decoration">
                        <div className="floating-pokeball">
                            <div className="pokeball-large"></div>
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="search-section">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="ポケモンの名前で検索... (例: pikachu)"
                    />
                    {isSearching && !loading && (
                        <p className="search-results-count">
                            {pokemon.length > 0
                                ? `「${searchQuery}」で ${pokemon.length} 件のポケモンが見つかりました`
                                : `「${searchQuery}」に一致するポケモンが見つかりませんでした`
                            }
                        </p>
                    )}
                </section>

                {/* Pokemon Grid */
                // ===== 条件分岐 =====
                }
                <section className="pokemon-section">
                    {loading && <Loading message={isSearching ? "検索中..." : "ポケモンを読み込み中..."} />}{/**isSearching: 検索中かどうかを判定 */}

                    {error && (
                        <Error
                            title="データの取得に失敗しました"
                            message={error}
                            onRetry={isSearching ? undefined : pokemonList.retry}
                        />
                    )}

                    {!loading && !error && pokemon.length === 0 && isSearching && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3 className="no-results-title">ポケモンが見つかりません</h3>
                            <p className="no-results-message">
                                別のキーワードで検索してみてください
                            </p>
                        </div>
                    )}
                    {/**
                    * keyがないとReactが正しく更新できな
                    * key={poke.id} はReactがどの要素が変わったか識別するために必要
                    */}
                    {!loading && !error && pokemon.length > 0 && (
                        <>
                            <div className="pokemon-grid">
                                {pokemon.map((poke) => (
                                    <PokemonCard key={poke.id} pokemon={poke} />
                                ))}
                            </div>

                            {!isSearching && pokemonList.totalPages > 1 && (
                                <>
                                    <Pagination
                                        currentPage={pokemonList.page}
                                        totalPages={pokemonList.totalPages}
                                        onPrevPage={pokemonList.prevPage}
                                        onNextPage={pokemonList.nextPage}
                                        onGoToPage={pokemonList.goToPage}
                                        hasPrev={pokemonList.hasPrev}
                                        hasNext={pokemonList.hasMore}
                                    />
                                    <p className="page-info">
                                        ページ {pokemonList.page + 1} / {pokemonList.totalPages}
                                        （全 {pokemonList.totalCount} 件）
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Home;
