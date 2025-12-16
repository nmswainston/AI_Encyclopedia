import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { getFontSize, setFontSize as saveFontSize } from '../lib/storage';

export function ReadingControls() {
  const [fontSize, setFontSizeState] = useState(() => getFontSize());

  useEffect(() => {
    document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`);
  }, [fontSize]);

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

  return (
    <div className="reading-controls">
      <div className="font-size-controls">
        <button
          onClick={decreaseFont}
          className="control-button"
          aria-label="Decrease font size"
          disabled={fontSize <= 12}
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="font-size-display">{fontSize}px</span>
        <button
          onClick={increaseFont}
          className="control-button"
          aria-label="Increase font size"
          disabled={fontSize >= 24}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
