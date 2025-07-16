import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from "../api";

function Chat() {
  const { user } = useAuth();
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/api/messages/${userId}`);
        setMessages(res.data);
      } catch (err) {
        console.log('Error loading chat', err);
      }
    };
    fetchChat();
  }, [userId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await api.post('/api/messages', {
        receiver_id: userId,
        message: newMessage
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-slate-50 flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-md px-4 py-2 rounded-lg text-slate-800 shadow-sm ${msg.sender_id === user.id
                ? 'bg-green-200 self-end'
                : 'bg-white border border-slate-300 self-start'
              }`}
          >
            <p>{msg.message}</p>
            <small className="text-slate-500 text-xs block mt-1">
              {new Date(msg.created_at).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-blue-200 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow"
        >
          Send
        </button>
      </form>
    </div>

  );
}

export default Chat;
