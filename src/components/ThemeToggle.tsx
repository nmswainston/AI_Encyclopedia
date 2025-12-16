import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

export default function ThemeToggle() {
  const { mode, effectiveTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (mode === 'system') {
      return <Monitor size={18} strokeWidth={1.75} />;
    }
    return effectiveTheme === 'dark' 
      ? <Sun size={18} strokeWidth={1.75} />
      : <Moon size={18} strokeWidth={1.75} />;
  };

  const getLabel = () => {
    if (mode === 'system') return 'System';
    return effectiveTheme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'} mode`}
      title={`Theme: ${getLabel()}`}
    >
      {getIcon()}
    </button>
  );
}
