import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    about: '',
    skills: '',
    photoUrl: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

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
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          age: data.age || '',
          gender: data.gender || '',
          about: data.about || '',
          skills: data.skills?.join(', ') || '',
          photoUrl: data.photoUrl || ''
        });
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Validate on frontend before sending
      if (formData.firstName.trim().length < 4) {
        setError('First name must be at least 4 characters');
        return;
      }
      
      if (formData.age < 18) {
        setError('Age must be at least 18');
        return;
      }
      
      // Prepare clean data - only include fields that are valid
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: parseInt(formData.age),
        about: formData.about.trim(),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      // Only include gender if it's a valid value
      if (formData.gender && ['male', 'female', 'other'].includes(formData.gender)) {
        updateData.gender = formData.gender;
      }

      // Only include photoUrl if it's a valid URL and not the default
      if (formData.photoUrl && formData.photoUrl.trim()) {
        const url = formData.photoUrl.trim();
        try {
          new URL(url); // Validate URL format
          updateData.photoUrl = url;
        } catch {
          setError('Invalid photo URL');
          return;
        }
      }

      console.log('Sending update data:', updateData); // Debug log

      const response = await fetch('http://localhost:3000/api/edit', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Backend sends JSON on success
        const data = await response.json();
        setUser(data.data);
        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          age: data.data.age || '',
          gender: data.data.gender || '',
          about: data.data.about || '',
          skills: data.data.skills?.join(', ') || '',
          photoUrl: data.data.photoUrl || ''
        });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Backend sends plain text on error
        const errorText = await response.text();
        setError(errorText || 'Update failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/updatePassword', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.text(); // Backend sends text

      if (response.ok) {
        setSuccess(data || 'Password updated!');
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data || 'Password update failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 mx-4 mt-4 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 mx-4 mt-4 rounded">
          {error}
        </div>
      )}

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Photo */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={user?.photoUrl || 'https://geographyandyou.com/images/user-profile.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700"
            />
          </div>
          <h2 className="text-white text-2xl font-bold mt-4">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex gap-3 mb-6">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 rounded"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded border border-zinc-700"
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded border border-zinc-700"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  minLength={4}
                  maxLength={50}
                  required
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
                  placeholder="At least 4 characters"
                />
              ) : (
                <p className="text-white mt-1">{user?.firstName}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
                />
              ) : (
                <p className="text-white mt-1">{user?.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min={18}
                  required
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
                />
              ) : (
                <p className="text-white mt-1">{user?.age}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-white mt-1 capitalize">{user?.gender || 'Not set'}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">About</label>
            {isEditing ? (
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            ) : (
              <p className="text-white mt-1">{user?.about}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm">Skills</label>
            {isEditing ? (
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Comma separated"
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.skills?.map((skill, i) => (
                  <span key={i} className="bg-zinc-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div>
              <label className="text-gray-400 text-sm">Photo URL</label>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-pink-500"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-gray-500 text-xs mt-1">Must be a valid URL</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-zinc-800 text-red-400 font-semibold py-3 rounded border border-zinc-700 hover:bg-zinc-700"
        >
          Logout
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Current password"
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ oldPassword: '', newPassword: '' });
                    setError('');
                  }}
                  className="flex-1 bg-zinc-700 text-white font-semibold py-3 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;