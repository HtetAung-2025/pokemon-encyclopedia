import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import PokemonDetail from './pages/PokemonDetail'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            Powered by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="footer-link">PokeAPI</a> |
            Built with React + Vite
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
