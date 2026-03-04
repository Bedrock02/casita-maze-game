import './App.css';
import laCasitaFront from '/la-casita-front.png';

type AppProps = {
  onStart: () => void;
};

function App({ onStart }: AppProps) {
  return (
    <div className="app">
      <h1>Buscando La Casita</h1>
      <img className="casita-image" src={laCasitaFront} alt="La Casita" />
    
      <button className="start-game-btn" type="button" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}

export default App;
