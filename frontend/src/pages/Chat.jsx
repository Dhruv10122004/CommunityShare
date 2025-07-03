import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Chat() {
    const { user } = useAuth(); // your details
    const { userId } = useParams(); // for details of the other person you are chattig with
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
    }, [userId]); // will get triggered whenever we open a new person's inbox (whom we have chated with)

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
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scrolls the chat view to the bottom (to the latest message) smoothly, using a ref attached to an empty div at the end of the messages list.
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto flex flex-col min-h-screen">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-md px-4 py-2 rounded-lg ${msg.sender_id === user.id ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}
          >
            <p>{msg.message}</p>
            <small className="text-gray-500 text-xs">{new Date(msg.created_at).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default Chat;