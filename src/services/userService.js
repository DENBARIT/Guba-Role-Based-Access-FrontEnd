
import api from '../api/apiClient.js';
// import { getUser } from './userService.js';
const base = '/User'; 

function mapUser(u) {
  return {
    id: u.id || u.Id,
    username: u.username || u.Username,
    email: u.email || u.Email,
    avatarUrl: u.avatarUrl || u.AvatarUrl || null,
    roles: u.roles || u.Roles || [],
    permissions: u.permissions || u.Permissions || [],
    isActive: typeof u.isActive !== 'undefined'
      ? u.isActive
      : (u.IsActive ?? true)
  };
}

// ==== User CRUD ====
export async function getUsers() {
  const res = await api.get(base);
  return (res.data || []).map(mapUser);
}

export async function getUser(id) {
  const res = await api.get(`${base}/${id}`);
  return mapUser(res.data);
}

export async function createUser(payload) {
  const body = {};
  if (typeof payload.username !== 'undefined') body.username = payload.username;
  if (typeof payload.email !== 'undefined') body.email = payload.email;
  if (typeof payload.password !== 'undefined' && payload.password) body.password = payload.password;
  if (typeof payload.isActive !== 'undefined') {
    body.isActive = payload.isActive;
    body.IsActive = payload.isActive;
  }
  if (Array.isArray(payload.roles)) body.roles = payload.roles; // Add this line

  const res = await api.post(base, body); // Use POST for create, not PUT
  return res?.data ? mapUser(res.data) : null;
}


export async function updateUser(id, payload) {
  const body = {};
  
  // Include all fields that might be updated
  if (payload.username) body.username = payload.username;
  if (payload.email) body.email = payload.email;
  if (payload.password) body.password = payload.password;
  if (typeof payload.isActive !== 'undefined') body.isActive = payload.isActive;
  
  // Add roles to the payload if they exist
  if (Array.isArray(payload.roles)) body.roles = payload.roles;

  try {
    const res = await api.put(`${base}/${id}`, body);
    return res.data ? mapUser(res.data) : null;
  } catch (error) {
    console.error('Update user error:', error.response?.data || error.message);
    throw error; // Re-throw to handle in the component
  }
}
export async function deleteUser(id) {
  await api.delete(`${base}/${id}`);
}

// ==== Roles ====
export async function assignRoleToUser(userId, roleId) {
  return (await api.post(`${base}/${userId}/roles/${roleId}`)).data;
}

export async function removeRoleFromUser(userId, roleId) {
  return (await api.delete(`${base}/${userId}/roles/${roleId}`)).data;
}

// ==== Profile & Auth ====
export async function getProfile() {
  const res = await api.get(`${base}/me`);
  return mapUser(res.data);
}

export async function changePassword({ currentPassword, newPassword }) {
  const body = { currentPassword, newPassword };
  return (await api.post(`${base}/change-password`, body)).data;
}

export async function forgotPassword(email) {
  return (await api.post(`${base}/forgot-password`, { email })).data;
}

export async function resetPassword({ token, newPassword }) {
  return (await api.post(`${base}/reset-password`, { token, newPassword })).data;
}

// ==== Utils ====
export function isAdminLike(u) {
  if (!u) return false;
  const roles = Array.isArray(u.roles) ? u.roles : [];
  return roles.includes('Admin');
}

export default function chooseLanding(user) {
  if (!user) return "/login";
  const roles = user.roles || [];
  if (roles.includes("Admin")) return "/dashboard";
  if (roles.includes("User")) return "/user-profile";
  return "/login";
}
// ==== Admin avatar upload for any user ====
export async function uploadUserAvatar(userId, file) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post(`${base}/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data; // { avatarUrl }
}
