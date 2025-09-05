
import React, { useEffect, useState, useMemo } from 'react'; 
import { getUsers, updateUser, deleteUser, createUser, uploadUserAvatar } from '../services/userService.js';
import { getRoles } from '../services/roleService.js';
import UserList from '../components/users/UserList.jsx';
import UserDetails from '../components/users/UserDetails.jsx';
import UserForm from '../components/users/UserForm.jsx';
import RequirePermission from '../components/layout/RequirePermission.jsx';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of users per page

  async function reload() {
    try {
      const [u, r] = await Promise.all([getUsers(), getRoles()]);
      setUsers(u);
      setRoles(r);

      if (selected) {
        const fresh = u.find(x => x.id === selected.id);
        if (fresh) setSelected(fresh);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load users or roles');
    }
  }

  useEffect(() => { reload(); }, []);

  const onToggleActive = async (u, next) => {
    try {
      await updateUser(u.id, { isActive: next });
      await reload();
    } catch (e) {
      console.error(e);
      alert('Failed to update active status');
    }
  };

  const onView = (u) => setSelected(u);
  const handleCreate = () => { setEditingUser(null); setShowForm(true); };
  const handleEdit = (u) => { setEditingUser(u); setShowForm(true); };
  const handleCancel = () => setShowForm(false);

  const handleSubmit = async (values) => {
    try {
      let savedUser;
      if (editingUser) {
        savedUser = await updateUser(editingUser.id, values);
        if (values.avatarFile) await uploadUserAvatar(editingUser.id, values.avatarFile);
      } else {
        savedUser = await createUser(values);
        if (values.avatarFile) await uploadUserAvatar(savedUser.id, values.avatarFile);
      }
      setShowForm(false);
      await reload();
    } catch (e) {
      console.error(e);
      alert(`Save failed: ${e.response?.data?.message || e.message || 'Unknown error'}`);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      await reload();
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  async function handleAvatarUpload(userId, file) {
    try {
      const response = await uploadUserAvatar(userId, file); 
      alert("Avatar uploaded!");
      await reload();
      return response;
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      alert("Upload failed");
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || (Array.isArray(u.roles) && u.roles.includes(roleFilter));
      const matchesActive =
        !activeFilter ||
        (activeFilter === 'active' && u.isActive) ||
        (activeFilter === 'inactive' && !u.isActive);
      return matchesSearch && matchesRole && matchesActive;
    });
  }, [users, searchTerm, roleFilter, activeFilter]);

  const filteredUsersWithAvatar = useMemo(() => {
    return filteredUsers.map(u => ({
      ...u,
      avatarUrl: u.avatarUrl
        ? (u.avatarUrl.startsWith('http')
            ? u.avatarUrl
            : `https://localhost:5001${u.avatarUrl}`)
        : null
    }));
  }, [filteredUsers]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsersWithAvatar.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsersWithAvatar.slice(start, start + pageSize);
  }, [filteredUsersWithAvatar, currentPage]);

  const roleCounts = useMemo(() => {
    const counts = {};
    users.forEach(u => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return;
      u.roles?.forEach(role => {
        counts[role] = (counts[role] || 0) + 1;
      });
    });
    return counts;
  }, [users, searchTerm]);

  const activeCounts = useMemo(() => {
    const counts = { active: 0, inactive: 0 };
    users.forEach(u => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return;
      if (u.isActive) counts.active += 1;
      else counts.inactive += 1;
    });
    return counts;
  }, [users, searchTerm]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Roles ({filteredUsers.length})</option>
          {roles.map(r => <option key={r.id} value={r.name}>{r.name} ({roleCounts[r.name] || 0})</option>)}
        </select>
        <select value={activeFilter} onChange={e => setActiveFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Status ({filteredUsers.length})</option>
          <option value="active">Active ({activeCounts.active})</option>
          <option value="inactive">Inactive ({activeCounts.inactive})</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <UserList
            users={paginatedUsers} // Use paginated users here
            onEdit={handleEdit}
            onDelete={onDelete}
            onView={onView}
            onToggleActive={onToggleActive}
          />

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="col-span-1">
          {showForm ? (
            <UserForm initial={editingUser} roles={roles} onCancel={handleCancel} onSubmit={handleSubmit} />
          ) : selected ? (
            <UserDetails user={selected} onAvatarUpload={handleAvatarUpload} />
          ) : (
            <div className="p-4 text-gray-600 bg-white shadow rounded">
              <RequirePermission anyOf={['users.create']} roles={['Admin']}>
                <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded w-full">
                  + Create User
                </button>
              </RequirePermission>
              <p className="mt-2">Select a user to see details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
