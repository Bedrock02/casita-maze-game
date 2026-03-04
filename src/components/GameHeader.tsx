import { useRef } from 'react';
import { formatTime } from '../utils';

interface GameHeaderProps {
  level: number;
  elapsedSeconds: number;
  timeLeft: number;
  showControlsHelp: boolean;
  setShowControlsHelp: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export default function GameHeader({
  level,
  elapsedSeconds,
  timeLeft,
  showControlsHelp,
  setShowControlsHelp,
}: GameHeaderProps) {
  const tooltipRef = useRef<HTMLButtonElement | null>(null);

  const countdownClass = timeLeft <= 60 ? 'danger' : '';

  return (
    <header className="hud">
      <div className="hud-title-row">
        <h1>Buscando La Casita</h1>
        <button
          ref={tooltipRef}
          className={`controls-tooltip ${showControlsHelp ? 'is-open' : ''}`}
          type="button"
          aria-label="Show controls help"
          aria-expanded={showControlsHelp}
          onClick={() => setShowControlsHelp((prev) => !prev)}
        >
          ?
          <span className="controls-tooltip-text">
            Desktop: arrow keys. Mobile: swipe on maze or use D-pad buttons.
          </span>
        </button>
      </div>
      <div className="hud-stats">
        <p>
          <span>Level</span>
          <strong>{level}</strong>
        </p>
        <p>
          <span>Elapsed</span>
          <strong>{formatTime(elapsedSeconds)}</strong>
        </p>
        <p>
          <span>Countdown</span>
          <strong className={countdownClass}>{formatTime(timeLeft)}</strong>
        </p>
      </div>
    </header>
  );
}
