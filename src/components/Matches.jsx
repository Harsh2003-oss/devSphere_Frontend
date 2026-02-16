import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/matches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch matches");
        return;
      }

      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-zinc-900 px-4 py-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        Your Matches 💕
      </h1>

      {matches.length === 0 ? (
        <p className="text-gray-400">
          No matches yet. Start swiping!
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((user) => (
            <div
              key={user._id}
              className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-700 transition"
              onClick={() => navigate(`/chat/${user._id}`)}
            >
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://geographyandyou.com/images/user-profile.png")
                }
              />

              <div>
                <h2 className="text-white font-semibold text-lg">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400 text-sm">
                  {user.about?.slice(0, 50)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
