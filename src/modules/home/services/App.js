import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BatePonto from './pages/BatePonto';
import Comercial from './pages/Comercial';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bate-ponto" element={<BatePonto />} />
        <Route path="/comercial" element={<Comercial />} />
      </Routes>
    </Router>
  );
}

export default App;