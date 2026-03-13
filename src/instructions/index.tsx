import { useState, useEffect } from 'react';
import { addDeviceResizeListener } from '../utils/helper';
import './index.css';
import MobileInstructions from '../components/MobileInstructions';
import DesktopInstructions from '../components/DesktopInstructions';

const Instructions = ({ onStart }: { onStart: () => void }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const cleanup = addDeviceResizeListener(setIsMobile);
    return cleanup;
  }, []);

  return (
    <div>
      {isMobile ? (
        <MobileInstructions />
      ) : (
        <DesktopInstructions />
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={onStart} className="start-game-btn">Empezar</button>
      </div>
    </div>
  );
};

export default Instructions;