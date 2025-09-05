
import React, { useEffect, useState } from 'react';
import { getProfile, updateUser, changePassword } from '../services/userService';
import UserForm from '../components/users/UserForm.jsx';
import api from '../api/apiClient.js';

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await getProfile();
        setProfile(p);
        setPreviewImage(p.avatarUrl ? `https://localhost:5001${p.avatarUrl}` : null);
      } catch (err) {
        console.error(err);
        setMessage('❌ Failed to load profile');
      }
    }
    loadProfile();
  }, []);

  // Update profile info (username/email/password)
  async function handleProfileSave(values) {
    try {
      const payload = {
        username: values.username,
        email: values.email
      };
      if (values.password?.trim()) payload.password = values.password;

      const updatedProfile = await updateUser(profile.id, payload);
      setProfile(prev => ({
        ...prev,
        username: updatedProfile.username,
        email: updatedProfile.email
      }));
      setMessage('✅ Profile updated successfully');
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update profile');
    }
  }

  // Change password
  async function handleChangePassword(e) {
    e.preventDefault();
    try {
      await changePassword({ currentPassword: oldPassword, newPassword });
      setMessage('✅ Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to change password');
    }
  }

  // Upload avatar
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Instant preview
    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await api.post('/User/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch updated profile from backend
      const updatedProfile = await getProfile();
      setProfile(updatedProfile);
      setPreviewImage(updatedProfile.avatarUrl ? `https://localhost:5001${updatedProfile.avatarUrl}` : null);

      setMessage('✅ Profile picture updated');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to upload avatar');
    }
  }

  if (!profile)
    return <div className="text-center text-xl font-bold text-gray-600 mt-10">Loading your profile...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl border border-purple-200">
      {/* Welcome */}
      <h1 className="text-4xl font-extrabold text-purple-700 mb-6 text-center">
        Welcome, <span className="text-blue-600">{profile.username} 🎉</span>
      </h1>

      {/* Profile Image */}
      <div className="flex items-center gap-6 mb-8 justify-center">
        <img
          src={previewImage || 'https://via.placeholder.com/120'}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-400 shadow-lg"
        />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Update Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-purple-100 file:text-purple-700
                       hover:file:bg-purple-200"
          />
        </div>
      </div>

      {/* Editable User Info */}
      {!editingProfile ? (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <p className="text-lg">
            <strong className="text-purple-600">Username:</strong> {profile.username}
          </p>
          <p className="text-lg">
            <strong className="text-purple-600">Email:</strong> {profile.email}
          </p>
          <button
            onClick={() => setEditingProfile(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            ✏️ Edit Profile
          </button>
        </div>
      ) : (
        <UserForm initial={profile} onCancel={() => setEditingProfile(false)} onSubmit={handleProfileSave} roles={[]} />
      )}

      {/* Roles */}
      <div className="bg-purple-50 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-2">🎭 Roles</h2>
        <ul className="list-disc pl-6 text-gray-700">{profile.roles.map(r => <li key={r}>{r}</li>)}</ul>
      </div>

      {/* Permissions */}
      <div className="bg-blue-50 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">🔐 Permissions</h2>
        <ul className="list-disc pl-6 text-gray-700">{profile.permissions.map(p => <li key={p}>{p}</li>)}</ul>
      </div>

      {/* Change Password */}
      {!showPasswordForm ? (
        <button
          onClick={() => setShowPasswordForm(true)}
          className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow hover:from-purple-600 hover:to-blue-600 transition text-lg font-semibold w-full"
        >
          🔑 Change Password
        </button>
      ) : (
        <form onSubmit={handleChangePassword} className="mt-6 bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold text-purple-700">Change Your Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded shadow hover:from-green-600 hover:to-teal-600"
            >
              ✅ Change
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-2 rounded shadow hover:from-gray-500 hover:to-gray-600"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      {/* Message */}
      {message && <p className="mt-4 text-center text-lg font-semibold text-red-600">{message}</p>}
    </div>
  );
}
