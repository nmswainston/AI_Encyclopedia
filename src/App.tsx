import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppLayout } from './layouts/AppLayout';
import { Library } from './pages/Library';
import { ScriptDetail } from './pages/ScriptDetail';
import { LearningPaths } from './pages/LearningPaths';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Library />} />
            <Route path="/scripts/:slug" element={<ScriptDetail />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

