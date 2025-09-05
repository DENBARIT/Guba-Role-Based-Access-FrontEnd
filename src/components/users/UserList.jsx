
import React from 'react';

export default function UserList({ users = [], onView, onEdit, onDelete, onToggleActive }) {
  return (
    <div className="border rounded bg-white shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Roles</th>
            <th className="px-4 py-2">Active</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              {/* Username with Avatar */}
              <td className="px-4 py-2 flex items-center gap-2">
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl} // already full URL from filteredUsersWithAvatar
                    alt={`${u.username} avatar`}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                    ?
                  </div>
                )}
                {u.username}
              </td>

              <td className="px-4 py-2">{u.email}</td>

              <td className="px-4 py-2">
                {Array.isArray(u.roles) && u.roles.length > 0 ? u.roles.join(', ') : '—'}
              </td>

              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={!!u.isActive}
                  onChange={e => onToggleActive && onToggleActive(u, e.target.checked)}
                />
              </td>

              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(u)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(u)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(u.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
