import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/feed?page=1&limit=20', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (status) => {
    if (currentIndex >= users.length) return;
    
    const userId = users[currentIndex]._id;
    const token = localStorage.getItem('token');

    try {
      await fetch(`http://localhost:3000/api/request/send/${status}/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStart);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (dragOffset > 100) {
      sendRequest('interested');
    } else if (dragOffset < -100) {
      sendRequest('ignored');
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - dragStart);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (dragOffset > 100) {
      sendRequest('interested');
    } else if (dragOffset < -100) {
      sendRequest('ignored');
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentUser = users[currentIndex];
  const rotate = dragOffset * 0.03;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="dev_logo.jpeg" alt="" className="w-8 h-8 rounded-4xl" />
          <span className="text-white font-bold text-xl">devSphere</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/profile')} className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </button>
          <button onClick={() => navigate('/connections')} className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
          </button>
         <button onClick={() => navigate('/messages')} className="text-white hover:text-gray-200 transition-colors">
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
</button>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-md mx-auto px-4 py-6">
        {currentIndex < users.length ? (
          <div className="relative" style={{ height: '70vh' }}>
            {/* Next cards in background */}
            {users.slice(currentIndex + 1, currentIndex + 2).map((user, i) => (
              <div
                key={user._id}
                className="absolute top-0 left-0 right-0 bg-zinc-800 rounded-xl overflow-hidden"
                style={{
                  height: '100%',
                  transform: `scale(${0.95 - i * 0.05}) translateY(${i * 8}px)`,
                  zIndex: -i - 1,
                }}
              />
            ))}

            {/* Main card */}
            <div
              className="absolute top-0 left-0 right-0 bg-zinc-800 rounded-xl overflow-hidden shadow-xl cursor-grab active:cursor-grabbing"
              style={{
                height: '100%',
                transform: `translateX(${dragOffset}px) rotate(${rotate}deg)`,
                opacity: isDragging ? opacity : 1,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Image */}
              <div className="relative h-3/5">
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.firstName}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://geographyandyou.com/images/user-profile.png'}
                />
                
                {/* Swipe indicators */}
                {dragOffset > 50 && (
                  <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-2xl px-4 py-2 rounded-lg rotate-[-15deg]">
                    LIKE
                  </div>
                )}
                {dragOffset < -50 && (
                  <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-2xl px-4 py-2 rounded-lg rotate-[15deg]">
                    NOPE
                  </div>
                )}

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h2 className="text-white text-3xl font-bold">
                    {currentUser.firstName} {currentUser.lastName}
                    {currentUser.age && <span className="font-normal"> {currentUser.age}</span>}
                  </h2>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 overflow-y-auto" style={{ height: '40%' }}>
                {currentUser.about && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">{currentUser.about}</p>
                  </div>
                )}

                {currentUser.skills?.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-sm">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.map((skill, i) => (
                        <span key={i} className="bg-zinc-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-white text-2xl font-bold mb-2">That's everyone!</h2>
            <p className="text-gray-400 mb-6">Check back later for new people</p>
            <button
              onClick={fetchFeed}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Buttons */}
        {currentIndex < users.length && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => sendRequest('ignored')}
              className="w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center hover:bg-red-500/10 transition"
            >
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <button
              onClick={() => sendRequest('interested')}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center shadow-lg hover:shadow-xl transition"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
            </button>



          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;