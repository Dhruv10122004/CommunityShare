import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Messages() {
    const { user } = useAuth(); // to get the current logged in user
    const [threads, setThreads] = useState([]);
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('/api/messages');
                setThreads(res.data);
            } catch (err) {
                console.log('Failed to load messages', err);
            }
        };
        fetchMessages();
    }, []);

    return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <ul>
        {threads.map(thread => (
          <li key={thread.user_id} className="border-b py-4">
            <Link to={`/messages/${thread.user_id}`} className="block hover:underline">
              <div className="font-semibold">{thread.username}</div>
              <div className="text-sm text-gray-600">Last: {thread.last_message}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Messages;