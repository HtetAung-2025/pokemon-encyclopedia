// ===== インポート =====
import { useParams, Link, useNavigate } from 'react-router-dom';  // React Routerのフック
import { usePokemonDetail } from '../hooks/usePokemonDetail';  // ポケモン詳細取得フック
import {
    formatPokemonId,  // ID表示フォーマット (#001)
    formatHeight,  // 身長フォーマット (m)
    formatWeight,  // 体重フォーマット (kg)
    getPokemonSpriteUrl,  // 画像URL取得
    typeColors,  // タイプ別の色
    typeTranslations,  // タイプの日本語訳
    statTranslations,  // ステータスの日本語訳
    getJapaneseName,  // 日本語名取得
    getJapaneseFlavorText,  // 日本語説明文取得
    getEnglishFlavorText  // 英語説明文取得
} from '../utils/api';
import Loading from '../components/Loading';  // ローディング表示
import Error from '../components/Error';  // エラー表示
import './PokemonDetail.css';

function PokemonDetail() {
    // ===== URLパラメータ取得 =====
    // URL: /pokemon/25 → id = "25"
    const { id } = useParams();

    // ===== ページ遷移用 =====
    const navigate = useNavigate();  // プログラムでページ遷移するため

    // ===== ポケモンデータ取得 =====
    // カスタムフックでAPIからデータを取得
    const { pokemon, species, loading, error, retry } = usePokemonDetail(id);

    // ===== ローディング中の表示 =====
    if (loading) {
        return (
            <div className="pokemon-detail">
                <div className="container">
                    <Loading message="ポケモンの情報を取得中..." />
                </div>
            </div>
        );
    }

    // ===== エラー時の表示 =====
    if (error) {
        return (
            <div className="pokemon-detail">
                <div className="container">
                    <Error
                        title="ポケモンが見つかりません"
                        message={error}
                        onRetry={retry}  // 再試行ボタン
                    />
                    {/* 図鑑へ戻るリンク */}
                    <div className="back-button-container">
                        <Link to="/" className="back-button">
                            ← 図鑑に戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ポケモンデータがない場合は何も表示しない
    if (!pokemon) return null;

    // ===== データ加工 =====
    const mainType = pokemon.types[0]?.type.name || 'normal';  // 最初のタイプを取得
    const typeColor = typeColors[mainType];  // タイプに対応する色
    const japaneseName = getJapaneseName(species);  // 日本語名
    const flavorText = getJapaneseFlavorText(species) || getEnglishFlavorText(species);  // 説明文

    // 種族値のプログレスバー計算用（最大値255）
    const maxStat = 255;

    // ===== 前へ/次へボタン用のID =====
    const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;  // ID=1なら前はない
    const nextId = pokemon.id + 1;

    return (
        // タイプの色をCSS変数として設定
        <div className="pokemon-detail" style={{ '--type-color': typeColor }}>
            <div className="container">
                {/* ===== ナビゲーション ===== */}
                <nav className="detail-nav">
                    {/* 図鑑に戻るリンク（Linkを使ってSPAとして動作） */}
                    <Link to="/" className="nav-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        図鑑に戻る
                    </Link>

                    {/* 前へ/次へボタン */}
                    <div className="nav-pokemon">
                        {/* 前のポケモンボタン（ID=1以外で表示） */}
                        {prevId && (
                            <button
                                className="nav-pokemon-btn"
                                onClick={() => navigate(`/pokemon/${prevId}`)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                {formatPokemonId(prevId)}
                            </button>
                        )}
                        {/* 次のポケモンボタン */}
                        <button
                            className="nav-pokemon-btn"
                            onClick={() => navigate(`/pokemon/${nextId}`)}
                        >
                            {formatPokemonId(nextId)}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* ===== メインコンテンツ ===== */}
                <div className="detail-content">
                    {/* ===== 左カラム: 画像 ===== */}
                    <div className="detail-image-section">
                        <div className="detail-image-container">
                            <div className="detail-image-bg"></div>
                            {/* ポケモンの公式アートワーク */}
                            <img
                                src={getPokemonSpriteUrl(pokemon.id)}
                                alt={pokemon.name}
                                className="detail-image"
                                onError={(e) => {
                                    // 画像が読み込めない場合のフォールバック
                                    e.target.src = pokemon.sprites?.front_default || '';
                                }}
                            />
                        </div>

                        {/* ===== スプライトギャラリー ===== */}
                        <div className="sprites-gallery">
                            <h4 className="sprites-title">スプライト</h4>
                            <div className="sprites-grid">
                                {/* 条件付きレンダリング: 画像がある場合のみ表示 */}
                                {pokemon.sprites?.front_default && (
                                    <img src={pokemon.sprites.front_default} alt="Front" className="sprite-img" />
                                )}
                                {pokemon.sprites?.back_default && (
                                    <img src={pokemon.sprites.back_default} alt="Back" className="sprite-img" />
                                )}
                                {pokemon.sprites?.front_shiny && (
                                    <img src={pokemon.sprites.front_shiny} alt="Shiny Front" className="sprite-img" />
                                )}
                                {pokemon.sprites?.back_shiny && (
                                    <img src={pokemon.sprites.back_shiny} alt="Shiny Back" className="sprite-img" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ===== 右カラム: 情報 ===== */}
                    <div className="detail-info-section">
                        {/* ===== ヘッダー: ID、名前、タイプ ===== */}
                        <header className="detail-header">
                            <span className="detail-id">{formatPokemonId(pokemon.id)}</span>
                            <h1 className="detail-name">
                                {/* 日本語名がある場合は表示 */}
                                {japaneseName && <span className="name-japanese">{japaneseName}</span>}
                                <span className="name-english">{pokemon.name}</span>
                            </h1>
                            {/* タイプバッジ */}
                            <div className="detail-types">
                                {/* map: タイプをループして表示 */}
                                {pokemon.types.map(({ type }) => (
                                    <span
                                        key={type.name}
                                        className="detail-type-badge"
                                        style={{ backgroundColor: typeColors[type.name] }}
                                    >
                                        {/* 英語→日本語変換（fire→ほのお） */}
                                        {typeTranslations[type.name] || type.name}
                                    </span>
                                ))}
                            </div>
                        </header>

                        {/* ===== 説明文 ===== */}
                        {flavorText && (
                            <div className="detail-description">
                                <p>{flavorText}</p>
                            </div>
                        )}

                        {/* ===== 身体情報（身長、体重、経験値） ===== */}
                        <div className="detail-physical">
                            <div className="physical-item">
                                <span className="physical-label">身長</span>
                                <span className="physical-value">{formatHeight(pokemon.height)}</span>
                            </div>
                            <div className="physical-item">
                                <span className="physical-label">体重</span>
                                <span className="physical-value">{formatWeight(pokemon.weight)}</span>
                            </div>
                            <div className="physical-item">
                                <span className="physical-label">基礎経験値</span>
                                <span className="physical-value">{pokemon.base_experience || '-'}</span>
                            </div>
                        </div>

                        {/* ===== 特性 ===== */}
                        <div className="detail-abilities">
                            <h3 className="section-title">特性</h3>
                            <div className="abilities-list">
                                {/* map: 特性をループして表示 */}
                                {pokemon.abilities.map(({ ability, is_hidden }) => (
                                    <span
                                        key={ability.name}
                                        className={`ability-badge ${is_hidden ? 'hidden-ability' : ''}`}
                                    >
                                        {ability.name.replace(/-/g, ' ')}
                                        {/* 隠れ特性の場合はラベル表示 */}
                                        {is_hidden && <span className="hidden-label">隠れ特性</span>}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ===== 種族値 ===== */}
                        <div className="detail-stats">
                            <h3 className="section-title">種族値</h3>
                            <div className="stats-list">
                                {/* map: ステータスをループして表示 */}
                                {pokemon.stats.map(({ stat, base_stat }) => (
                                    <div key={stat.name} className="stat-item">
                                        {/* ステータス名（日本語変換） */}
                                        <span className="stat-name">{statTranslations[stat.name] || stat.name}</span>
                                        {/* プログレスバー */}
                                        <div className="stat-bar-container">
                                            <div
                                                className="stat-bar"
                                                style={{
                                                    // バーの幅を計算（base_stat / 255 * 100%）
                                                    width: `${(base_stat / maxStat) * 100}%`,
                                                    // 値によって色を変える（高い=緑、中=橙、低い=赤）
                                                    backgroundColor: base_stat >= 100 ? '#4caf50' : base_stat >= 60 ? '#ff9800' : '#f44336'
                                                }}
                                            ></div>
                                        </div>
                                        {/* 数値 */}
                                        <span className="stat-value">{base_stat}</span>
                                    </div>
                                ))}
                                {/* 合計値 */}
                                <div className="stat-item stat-total">
                                    <span className="stat-name">合計</span>
                                    <span className="stat-value">
                                        {/* reduce: 全ステータスを合計 */}
                                        {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokemonDetail;
