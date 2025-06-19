import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const code = uuidv4().slice(0, 6).toUpperCase();
    setRoomCode(code);
    setShowGenerated(true);
  };

  const handleJoin = () => {
    if (!username || !roomCode) return alert('Enter your name and room code.');
    navigate(`/room/${roomCode}?username=${username}`);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl space-y-6 drop-shadow-lg items-center justify-center">
        <h1 className="text-3xl text-white font-semibold text-center">AA BHEN CHUGLI KARE</h1>
        <button
          onClick={handleCreateRoom}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition"
        >
          Create Room
        </button>
        <div className="space-y-4">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-2 bg-gray-700 placeholder-white rounded-full focus:outline-none"
          />
          <input
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter Room Code"
            className="w-full px-4 py-2 bg-gray-700 placeholder-white rounded-full focus:outline-none"
          />
          <button
            onClick={handleJoin}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition"
          >
            Join Room
          </button>
        </div>
        {showGenerated && (
          <div className="mt-4 px-4 py-2 bg-gray-700 rounded text-center text-indigo-300">
            Code: <span className="font-mono">{roomCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}