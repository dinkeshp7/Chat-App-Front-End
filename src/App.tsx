import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import ChatRoom from './components/ChatRoom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
