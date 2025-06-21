// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PrintPage from './pages/PrintPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/print/:version" element={<PrintPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
