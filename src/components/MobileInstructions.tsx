import swipeGesture from "../assets/swipe-gesture.png";
import MobileControls from "./MobileControls";

const MobileInstructions = () => {
    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80vh',
            padding: '20px',
            textAlign: 'center',
            justifyContent: 'space-around',
            marginTop: '20px'
        }}>
            <h1><strong>Controles Móviles:</strong></h1>
            <h3>Desliza en la dirección que quieres moverte</h3>
            <img src={swipeGesture} alt="Swipe gesture" className="swipe-animation" style={{ width: '100px', height: '100px', margin: '10px 0' }} />
            <h3>O usa las flechas en la parte inferior de la pantalla</h3>
            <MobileControls className="instructions-mobile-controls" />
        </div>
    );
};
export default MobileInstructions;