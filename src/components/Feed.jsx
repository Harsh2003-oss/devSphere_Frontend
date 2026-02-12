import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show alert
      if (status === "interested") {
        setActionAlert("Liked ❤️");
      } else {
        setActionAlert("Ignored ❌");
      }

      setTimeout(() => {
        setActionAlert(null);
      }, 1500);

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

      {/* 🔥 Top Alert */}
      {actionAlert && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold">
            {actionAlert}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="dev_logo.jpeg" alt="" className="w-8 h-8 rounded-4xl" />
          <span className="text-white font-bold text-xl">devSphere</span>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-md mx-auto px-4 py-6">
        {currentIndex < users.length ? (
          <div className="relative" style={{ height: '70vh' }}>

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
                  onError={(e) =>
                    e.target.src = 'https://geographyandyou.com/images/user-profile.png'
                  }
                />

                {/* ✅ Match Badge */}
                {currentUser.matchScore !== undefined && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                    <span
                      className={`font-bold text-lg ${
                        currentUser.matchScore > 70
                          ? 'text-green-400'
                          : currentUser.matchScore > 40
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {currentUser.matchScore}% Match
                    </span>
                  </div>
                )}

                {/* Swipe Indicators */}
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

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h2 className="text-white text-3xl font-bold">
                    {currentUser.firstName} {currentUser.lastName}
                    {currentUser.age && (
                      <span className="font-normal"> {currentUser.age}</span>
                    )}
                  </h2>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 overflow-y-auto" style={{ height: '40%' }}>
                {currentUser.about && (
                  <p className="text-gray-300 text-sm mb-3">
                    {currentUser.about}
                  </p>
                )}

                {currentUser.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-zinc-700 text-gray-300 px-3 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-white text-2xl font-bold mb-2">
              That's everyone!
            </h2>
            <p className="text-gray-400 mb-6">
              Check back later for new people
            </p>
            <button
              onClick={fetchFeed}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Bottom Buttons */}
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
