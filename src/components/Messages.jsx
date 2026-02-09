import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      } else {
        setError('Failed to load conversations');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/feed')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-white font-bold text-xl">Messages</span>
        <button onClick={() => navigate('/profile')} className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="m-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {conversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-white text-2xl font-bold mb-2">No messages yet</h2>
            <p className="text-gray-400 mb-6">Start chatting with your connections!</p>
            <button
              onClick={() => navigate('/connections')}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              View Connections
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {conversations.map((conversation) => (
              <div
                key={conversation.user._id}
                onClick={() => navigate(`/chat/${conversation.user._id}`)}
                className="flex items-center gap-4 p-4 hover:bg-zinc-800 cursor-pointer transition"
              >
                {/* Profile Photo */}
                <div className="relative">
                  <img
                    src={conversation.user.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
                    alt={conversation.user.firstName}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://geographyandyou.com/images/user-profile.png';
                    }}
                  />
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Info & Last Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-lg">
                      {conversation.user.firstName} {conversation.user.lastName}
                    </h3>
                    <span className="text-gray-400 text-xs">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p
                    className={`truncate text-sm ${
                      conversation.unreadCount > 0
                        ? 'text-white font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Arrow Icon */}
                <svg
                  className="w-5 h-5 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;