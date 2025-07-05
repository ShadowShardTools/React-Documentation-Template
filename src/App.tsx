// src/App.tsx
import { Routes, Route, HashRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-0 lg:px-8 md:px-6">
        <Routes>
          <Route path="/:docId?" element={<MainPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
