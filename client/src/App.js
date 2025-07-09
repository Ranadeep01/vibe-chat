import logo from './logo.svg';
import './App.css';
import Chat from './pages/chat';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat/:userName/:roomName" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
