interface MobileControlsProps {
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void | undefined;
  className?: string;
}

export default function MobileControls({ onMove, className }: MobileControlsProps) {
  return (
    <section className={className || "mobile-controls"} aria-label="Touch controls">
      <button type="button" onClick={() => onMove?.('up')} aria-label="Move up">
        ↑
      </button>
      <button type="button" onClick={() => onMove?.('left')} aria-label="Move left">
        ←
      </button>
      <button type="button" onClick={() => onMove?.('down')} aria-label="Move down">
        ↓
      </button>
      <button type="button" onClick={() => onMove?.('right')} aria-label="Move right">
        →
      </button>
    </section>
  );
}
