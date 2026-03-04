interface MobileControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export default function MobileControls({ onMove }: MobileControlsProps) {
  return (
    <section className="mobile-controls" aria-label="Touch controls">
      <button type="button" onClick={() => onMove('up')} aria-label="Move up">
        ↑
      </button>
      <button type="button" onClick={() => onMove('left')} aria-label="Move left">
        ←
      </button>
      <button type="button" onClick={() => onMove('down')} aria-label="Move down">
        ↓
      </button>
      <button type="button" onClick={() => onMove('right')} aria-label="Move right">
        →
      </button>
    </section>
  );
}
