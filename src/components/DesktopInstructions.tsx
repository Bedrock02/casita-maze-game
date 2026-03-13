import MobileControls from "./MobileControls";

const DesktopInstructions = () => {
    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80vh',
            padding: '20px',
            textAlign: 'center',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '20px',
        }}>
            <h1><strong>Controles:</strong></h1>
            <h3>Usa las flechas del teclado para moverte</h3>
            <MobileControls className="instructions-mobile-controls" />
        </div>
    );
};

export default DesktopInstructions;