import { useState, useEffect } from 'react';
import { Minus, Plus, Maximize2, Minimize2 } from 'lucide-react';
import { getFontSize, setFontSize as saveFontSize, getReadingMode, setReadingMode as saveReadingMode } from '../lib/storage';

interface ReadingControlsProps {
  onReadingModeChange?: (enabled: boolean) => void;
}

export function ReadingControls({ onReadingModeChange }: ReadingControlsProps) {
  const [fontSize, setFontSizeState] = useState(16);
  const [readingMode, setReadingModeState] = useState(false);

  useEffect(() => {
    setFontSizeState(getFontSize());
    setReadingModeState(getReadingMode());
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    if (onReadingModeChange) {
      onReadingModeChange(readingMode);
    }
  }, [readingMode, onReadingModeChange]);

  const decreaseFont = () => {
    const newSize = Math.max(12, fontSize - 2);
    setFontSizeState(newSize);
    saveFontSize(newSize);
  };

  const increaseFont = () => {
    const newSize = Math.min(24, fontSize + 2);
    setFontSizeState(newSize);
    saveFontSize(newSize);
  };

  const toggleReadingMode = () => {
    const newMode = !readingMode;
    setReadingModeState(newMode);
    saveReadingMode(newMode);
  };

  return (
    <div className="reading-controls">
      <div className="font-size-controls">
        <button
          onClick={decreaseFont}
          className="control-button"
          aria-label="Decrease font size"
          disabled={fontSize <= 12}
        >
          <Minus size={16} />
        </button>
        <span className="font-size-display">{fontSize}px</span>
        <button
          onClick={increaseFont}
          className="control-button"
          aria-label="Increase font size"
          disabled={fontSize >= 24}
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={toggleReadingMode}
        className="control-button reading-mode-button"
        aria-label={readingMode ? 'Exit reading mode' : 'Enter reading mode'}
        title={readingMode ? 'Exit reading mode' : 'Enter reading mode'}
      >
        {readingMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  );
}
