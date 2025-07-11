import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Chat() {
  const { user } = useAuth();
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`/api/messages/${userId}`);
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
      const res = await axios.post('/api/messages', {
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
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-[#F3F4E8] flex flex-col">
      <h2 className="text-2xl font-bold text-[#4e5d58] mb-6">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-md px-4 py-2 rounded-lg text-[#4e5d58] shadow-sm ${
              msg.sender_id === user.id
                ? 'bg-[#A7C3AD] self-end'
                : 'bg-white border border-[#D4DBC1] self-start'
            }`}
          >
            <p>{msg.message}</p>
            <small className="text-[#667c75] text-xs block mt-1">
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
          className="flex-1 border border-[#A7C3AD] p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-[#819A91]"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-[#819A91] text-white px-6 py-2 rounded-lg hover:bg-[#6d857f] transition-colors duration-200 shadow"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
