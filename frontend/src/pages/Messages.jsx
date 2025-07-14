import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from "../api";

function Messages() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/api/messages');
        setThreads(res.data);
      } catch (err) {
        console.log('Failed to load messages', err);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#F3F4E8] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#4e5d58]">Messages</h1>
      <ul className="divide-y divide-[#D4DBC1]">
        {threads.map(thread => (
          <li key={thread.user_id} className="py-4">
            <Link
              to={`/messages/${thread.user_id}`}
              className="block hover:bg-[#D4DBC1] rounded-lg p-4 transition-colors duration-200"
            >
              <div className="font-semibold text-[#4e5d58]">{thread.username}</div>
              <div className="text-sm text-[#667c75] mt-1">Last: {thread.last_message}</div>
            </Link>
          </li>
        ))}
      </ul>
      {threads.length === 0 && (
        <p className="text-[#819A91] mt-10 text-center">No message threads found.</p>
      )}
    </div>
  );
}

export default Messages;
