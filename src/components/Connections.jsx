import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('connections'); // 'connections' or 'requests'
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchConnections();
    fetchRequests();
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

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/user/requests/received', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter only interested requests (pending)
        const pendingRequests = data.data.filter(req => req.status === 'interested');
        setRequests(pendingRequests || []);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/request/review/${status}/${requestId}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        // Refresh both lists
        fetchRequests();
        if (status === 'accepted') {
          fetchConnections();
        }
        
        // Show success message
        const action = status === 'accepted' ? 'accepted' : 'rejected';
        setError('');
        // Optional: Show success toast
        alert(`Request ${action} successfully!`);
      } else {
        setError('Failed to process request');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleMessage = (user) => {
    navigate(`/chat/${user._id}`);
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

      {/* Tabs */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-4 font-semibold transition relative ${
              activeTab === 'connections'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Connections ({connections.length})
            {activeTab === 'connections' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-4 font-semibold transition relative ${
              activeTab === 'requests'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Requests ({requests.length})
            {activeTab === 'requests' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-500" />
            )}
            {requests.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <>
            {connections.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4"></div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((connection) => (
                  <div
                    key={connection._id}
                    className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition"
                  >
                    <div className="flex items-start p-4 gap-4">
                      <img
                        src={connection.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
                        alt={connection.firstName}
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://geographyandyou.com/images/user-profile.png';
                        }}
                      />

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

                    <div className="px-4 pb-4 flex gap-2">
                      <button 
                        onClick={() => handleMessage(connection)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded text-sm font-semibold hover:from-pink-600 hover:to-orange-600 transition"
                      >
                        Message
                      </button>
                      <button 
                        onClick={() => handleViewProfile(connection)}
                        className="px-4 bg-zinc-700 text-white py-2 rounded text-sm font-semibold hover:bg-zinc-600 transition"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {requests.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4"></div>
                <h2 className="text-white text-2xl font-bold mb-2">No pending requests</h2>
                <p className="text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition"
                  >
                    <div className="flex items-start p-4 gap-4">
                      <img
                        src={request.fromUserId.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
                        alt={request.fromUserId.firstName}
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://geographyandyou.com/images/user-profile.png';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg">
                          {request.fromUserId.firstName} {request.fromUserId.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          Wants to connect with you
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestAction(request._id, 'accepted')}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 px-4 rounded font-semibold hover:from-pink-600 hover:to-orange-600 transition"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(request._id, 'rejected')}
                            className="flex-1 bg-zinc-700 text-white py-2 px-4 rounded font-semibold hover:bg-zinc-600 transition"
                          >
                            ✕ Reject
                          </button>
                          <button
                            onClick={() => handleViewProfile(request.fromUserId)}
                            className="px-4 bg-zinc-700 text-white py-2 rounded font-semibold hover:bg-zinc-600 transition"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50" onClick={() => setShowProfileModal(false)}>
          <div className="bg-zinc-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-4 flex items-center justify-between">
              <h3 className="text-white text-xl font-bold">Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 text-center border-b border-zinc-700">
              <img
                src={selectedUser.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
                alt={selectedUser.firstName}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-zinc-700"
                onError={(e) => e.target.src = 'https://geographyandyou.com/images/user-profile.png'}
              />
              <h2 className="text-white text-2xl font-bold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              {selectedUser.age && (
                <p className="text-gray-400 mt-1">{selectedUser.age} years old</p>
              )}
              {selectedUser.gender && (
                <p className="text-gray-400 capitalize">{selectedUser.gender}</p>
              )}
            </div>

            <div className="p-6 space-y-4">
              {selectedUser.about && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">About</h4>
                  <p className="text-white">{selectedUser.about}</p>
                </div>
              )}

              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-zinc-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-700">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  handleMessage(selectedUser);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded font-semibold hover:from-pink-600 hover:to-orange-600 transition"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;