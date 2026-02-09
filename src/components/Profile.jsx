import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Edit Profile States
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    photoUrl: '',
    about: '',
    skills: ''
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Change Password States
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/view', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        
        // Set edit form with current values
        setEditForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          age: data.age || '',
          gender: data.gender || '',
          photoUrl: data.photoUrl || '',
          about: data.about || '',
          skills: data.skills ? data.skills.join(', ') : ''
        });
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Validate on frontend before sending
      if (editForm.firstName.trim().length < 4) {
        setEditError('First name must be at least 4 characters');
        return;
      }
      
      if (editForm.age && editForm.age < 18) {
        setEditError('Age must be at least 18');
        return;
      }
      
      // Convert skills string to array
      const skillsArray = editForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const updateData = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        age: editForm.age ? parseInt(editForm.age) : undefined,
        about: editForm.about.trim(),
        skills: skillsArray
      };

      // Only include gender if it's a valid value
      if (editForm.gender && ['male', 'female', 'other'].includes(editForm.gender)) {
        updateData.gender = editForm.gender;
      }

      // Only include photoUrl if it's a valid URL
      if (editForm.photoUrl && editForm.photoUrl.trim()) {
        const url = editForm.photoUrl.trim();
        try {
          new URL(url); // Validate URL format
          updateData.photoUrl = url;
        } catch {
          setEditError('Invalid photo URL');
          return;
        }
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      const response = await fetch('http://localhost:3000/api/edit', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        setEditSuccess('Profile updated successfully!');
        setTimeout(() => {
          setShowEditModal(false);
          fetchProfile();
        }, 1500);
      } else {
        const errorText = await response.text();
        setEditError(errorText || 'Failed to update profile');
      }
    } catch (err) {
      setEditError('Network error: ' + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/updatePassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.text();
        setPasswordSuccess(data || 'Password updated successfully!');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }, 1500);
      } else {
        const data = await response.text();
        setPasswordError(data || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError('Network error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
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
        <span className="text-white font-bold text-xl">Profile</span>
        <button onClick={() => navigate('/connections')} className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
        </button>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Photo & Name */}
        <div className="text-center mb-8">
          <img
            src={user?.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
            alt={user?.firstName}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-pink-500"
            onError={(e) => {
              e.target.src = 'https://geographyandyou.com/images/user-profile.png';
            }}
          />
          <h1 className="text-white text-3xl font-bold mb-1">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-zinc-800 text-white py-3 rounded-lg font-semibold hover:bg-zinc-700 transition"
          >
            Change Password
          </button>
        </div>

        {/* Profile Details */}
        <div className="bg-zinc-800 rounded-lg p-6 space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">First Name</p>
              <p className="text-white font-semibold">{user?.firstName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Last Name</p>
              <p className="text-white font-semibold">{user?.lastName || 'Not set'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Age</p>
              <p className="text-white font-semibold">{user?.age || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Gender</p>
              <p className="text-white font-semibold capitalize">{user?.gender || 'Not set'}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">About</p>
            <p className="text-white">{user?.about || 'No bio yet'}</p>
          </div>

          {user?.skills && user.skills.length > 0 && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
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

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-zinc-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-4 flex items-center justify-between">
              <h3 className="text-white text-xl font-bold">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
                  {editSuccess}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">First Name *</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                    minLength={4}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Age</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    min="18"
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Photo URL</label>
                <input
                  type="url"
                  value={editForm.photoUrl}
                  onChange={(e) => setEditForm({...editForm, photoUrl: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">About</label>
                <textarea
                  value={editForm.about}
                  onChange={(e) => setEditForm({...editForm, about: e.target.value})}
                  rows="3"
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                  placeholder="JavaScript, React, Node.js"
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded font-semibold hover:from-pink-600 hover:to-orange-600 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-zinc-800 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-zinc-700 p-4 flex items-center justify-between">
              <h3 className="text-white text-xl font-bold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm block mb-2">Old Password</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded font-semibold hover:from-pink-600 hover:to-orange-600 transition"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;