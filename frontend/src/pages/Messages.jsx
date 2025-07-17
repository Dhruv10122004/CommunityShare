import { useState, useEffect } from 'react';
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
    <div className="p-6 max-w-4xl mx-auto bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Messages</h1>

      <ul className="divide-y divide-gray-200">
        {threads.map(thread => (
          <li key={thread.user_id} className="py-4">
            <Link
              to={`/messages/${thread.user_id}`}
              className="block rounded-xl p-4 bg-white hover:bg-blue-200 transition-colors duration-200 shadow-sm border border-[#D4DBC1]"
            >
              <div className="font-semibold text-slate-900">{thread.username}</div>
              <div className="text-sm text-slate-800 mt-1">Last: {thread.last_message}</div>
            </Link>
          </li>
        ))}
      </ul>

      {threads.length === 0 && (
        <p className="text-slate-900 mt-10 text-center text-lg">No message threads found.</p>
      )}
    </div>
  );
}

export default Messages;
