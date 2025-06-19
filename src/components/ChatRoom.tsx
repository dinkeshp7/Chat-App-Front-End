import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { connectSocket, sendMessage, onMessage } from '../socket';

type Message = { sender: string; text: string };

export default function ChatRoom() {
  const { roomId } = useParams(); //useParams() is a React Router hook that lets you access dynamic route parameters from the URL. return roomid ->http://localhost:5173/room/XYZ123
  const [searchParams] = useSearchParams(); //This hook gives you access to the query parameters in the URL. returns username -> http://localhost:5173/room/XYZ123?username=Dinkesh
  const navigate = useNavigate();
  const username = searchParams.get('username');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [users, setUsers] = useState(1);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username){
        navigate('/');
        return;
    } 
    const socket = connectSocket("http://localhost:8080");

    socket.onopen = () => {
      sendMessage({ type: 'join-room', room: roomId });
    };
    onMessage(data => {
      if (data.type === 'message') setMessages(prev => [...prev, { sender: data.sender, text: data.text }]);
      if (data.type === 'user-count') setUsers(data.count);
    });
    return () => socket.close();  //cleanup function

//     If your component is re-mounted or navigated between (e.g., between rooms), a new WebSocket is created each time.
//     Without closing the old one, you’ll end up with:
//     Duplicate open sockets
//     Duplicate messages received
//     Memory leaks

  }, [roomId]);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]); // Putting ? -> If the left-hand side is not null or undefined, then access the property or call the function
  //This line is a React hook that ensures the chat window automatically scrolls to the latest message whenever a new message arrives.

  const handleSend = () => {
    if (!text.trim()) return;  //Removes the leading and trailing white space and line terminator characters from a string.
    sendMessage({ type: 'message', room: roomId, sender: username, text });
    setText('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4 text-gray-400">
        <div>Room: <span className="font-mono">{roomId}</span></div>
        <div>{users} user{users > 1 ? 's' : ''}</div>
      </div>
      <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === username ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`${m.sender === username ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-100'} px-4 py-2 rounded-lg max-w-xs`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs mt-1 opacity-75">{m.sender}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type and press Enter"
          className="flex-1 px-4 py-2 bg-gray-700 rounded-full focus:outline-none text-gray-100"
        />
        <button
          onClick={handleSend}
          className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}