import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/user/connections', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(data.data || []);
      } else {
        setError('Failed to load connections');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
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
        <span className="text-white font-bold text-xl">Connections</span>
        <button onClick={() => navigate('/profile')} className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {connections.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-white text-2xl font-bold mb-2">No connections yet</h2>
            <p className="text-gray-400 mb-6">Start swiping to find your matches!</p>
            <button
              onClick={() => navigate('/feed')}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Go to Feed
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold">
                {connections.length} {connections.length === 1 ? 'Connection' : 'Connections'}
              </h2>
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition"
                >
                  <div className="flex items-start p-4 gap-4">
                    {/* Photo */}
                    <img
                      src={connection.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
                      alt={connection.firstName}
                      className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://geographyandyou.com/images/user-profile.png';
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg">
                        {connection.firstName} {connection.lastName}
                        {connection.age && (
                          <span className="font-normal text-gray-400 ml-1">{connection.age}</span>
                        )}
                      </h3>

                      {connection.gender && (
                        <p className="text-gray-400 text-sm capitalize mb-2">{connection.gender}</p>
                      )}

                      {connection.about && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {connection.about}
                        </p>
                      )}

                      {connection.skills && connection.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {connection.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="bg-zinc-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {connection.skills.length > 3 && (
                            <span className="bg-zinc-700 text-gray-300 px-2 py-1 rounded text-xs">
                              +{connection.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 pb-4 flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded text-sm font-semibold">
                      Message
                    </button>
                    <button className="px-4 bg-zinc-700 text-white py-2 rounded text-sm font-semibold">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Connections;