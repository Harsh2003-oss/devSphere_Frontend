import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Likes = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/likes/received",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await response.json();
    setUsers(data);
  };

  const respondToLike = async (status, userId) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:3000/api/send/${status}/${userId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchLikes();
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <h1 className="text-white text-2xl font-bold mb-6">
        People Who Liked You ❤️
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No likes yet</p>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div
              key={user._id}
              className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-white font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => respondToLike("ignored", user._id)}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  ❌
                </button>

                <button
                  onClick={() => respondToLike("interested", user._id)}
                  className="bg-green-500 px-3 py-1 rounded text-white"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Likes;
