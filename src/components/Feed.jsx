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

      const response = await fetch(
        'http://localhost:3000/api/feed?page=1&limit=20',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sendRequest = async (status) => {
    if (currentIndex >= users.length) return;

    const userId = users[currentIndex]._id;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:3000/api/send/${status}/${userId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.match) {
        setActionAlert("🎉 It's a Match!");
      } else {
        setActionAlert(
          status === "interested" ? "Liked ❤️" : "Ignored ❌"
        );
      }

      setTimeout(() => setActionAlert(null), 1500);

      setCurrentIndex((prev) => prev + 1);
      setDragOffset(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Drag Handlers
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

    if (dragOffset > 100) sendRequest('interested');
    else if (dragOffset < -100) sendRequest('ignored');

    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch
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

    if (dragOffset > 100) sendRequest('interested');
    else if (dragOffset < -100) sendRequest('ignored');

    setIsDragging(false);
    setDragOffset(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const currentUser = users[currentIndex];
  const rotate = dragOffset * 0.03;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-3xl"></div>

      {/* Alert */}
      {actionAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black/80 text-white px-6 py-3 rounded-xl">
            {actionAlert}
          </div>
        </div>
      )}

      {/* ✅ HEADER (UPDATED) */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="dev_logo.jpeg" alt="logo" className="w-8 h-8 rounded-full" />
          <span className="text-white font-bold text-xl">devSphere</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/connections")} className="text-white px-3 py-1 hover:bg-white/20 rounded">
            Connections
          </button>
          <button onClick={() => navigate("/matches")} className="text-white px-3 py-1 hover:bg-white/20 rounded">
            Matches
          </button>
          <button onClick={() => navigate("/likes")} className="text-white px-3 py-1 hover:bg-white/20 rounded">
            Likes
          </button>

          {/* ✅ LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-md ml-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Card Section */}
      <div className="max-w-md mx-auto px-4 py-6">
        {currentIndex < users.length ? (
          <div className="relative h-[70vh]">

            <div
              className="absolute w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              style={{
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

              <div className="relative h-3/5">
                <img
                  src={currentUser.photoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                  <h2 className="text-white text-3xl font-bold">
                    {currentUser.firstName} {currentUser.lastName}{" "}
                    <span className="text-lg">{currentUser.age}</span>
                  </h2>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-300 text-sm mb-3">
                  {currentUser.about}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentUser.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-white">
            No more users
          </div>
        )}

        {/* Buttons */}
        {currentIndex < users.length && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => sendRequest('ignored')}
              className="w-14 h-14 rounded-full border-2 border-red-500"
            >
              ✕
            </button>

            <button
              onClick={() => sendRequest('interested')}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-2xl"
            >
              ❤️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;