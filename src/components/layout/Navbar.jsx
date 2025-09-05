
import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

import {
  canAccessUsers,
  canAccessRoles,
  canAccessPermissions,
  canAccessProfile
} from '../..//utils/permission.js';

export default function Navbar() {
  const { isAuthenticated, user, permissions = [], logout } = useAuth();
  const location = useLocation();

  const isAdmin = (user?.roles || []).includes('Admin');
  const hasSelfRead = permissions.includes('self.read');

  // Compute permission-based visibility
  const showUsers = canAccessUsers(permissions);
  const showRoles = canAccessRoles(permissions);
  const showPermissions = canAccessPermissions(permissions);
  const showProfile = canAccessProfile(permissions);

  // Brand destination: Admin -> dashboard, others with self.read -> profile, else -> '/'
  const brandTo = isAdmin ? '/dashboard' : (hasSelfRead ? '/user-profile' : '/');

  // Hide Home & Contact if user is in admin/profile section
  console.log('Navbar location.pathname =', location.pathname);

  const isAdminSection =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/users') ||
    location.pathname.startsWith('/roles') ||
    location.pathname.startsWith('/permissions') ||
    location.pathname.startsWith('/user-profile')||
location.pathname.startsWith('/audit-logs');
  return (
    <header className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        {/* Brand/logo */}
        <Link
          to={brandTo}
          className="font-extrabold text-2xl tracking-wide hover:text-yellow-300 transition-colors"
        >
          Guba <span className="text-yellow-400">RBAC</span>
        </Link>

        {isAuthenticated ? (
          <nav className="flex items-center gap-6">

            {/* Home + Contact (hidden in admin/profile sections) */}
            {!isAdminSection && (
              <>
                <NavLink to="/" className="text-white hover:text-yellow-300">Home</NavLink>
                <a href="#footer" className="text-white hover:text-yellow-300">Contact</a>
              </>
            )}

            {/* Profile */}
            {showProfile && (
              <NavLink
                to="/user-profile"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
                }
              >
                Profile
              </NavLink>
            )}

            {/* Dashboard (Admin-only for now) */}
            {isAdmin && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
                }
              >
                Dashboard
              </NavLink>
            )}
{isAdmin && (
  <NavLink
    to="/audit-logs"
    className={({ isActive }) =>
      isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
    }
  >
    Audit Logs
  </NavLink>
)}
            {/* Users */}
            {showUsers && (
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
                }
              >
                Users
              </NavLink>
            )}

            {/* Roles */}
            {showRoles && (
              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
                }
              >
                Roles
              </NavLink>
            )}

            {/* Permissions */}
            {showPermissions && (
              <NavLink
                to="/permissions"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
                }
              >
                Permissions
              </NavLink>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-700 transition"
            >
              Logout
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-6">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
              }
            >
              Home
            </NavLink>

            {/* Contact */}
            <a href="#footer" className="text-white hover:text-yellow-300">
              Contact
            </a>

            {/* Login */}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
              }
            >
              Login
            </NavLink>

            {/* Register */}
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'text-yellow-300 font-medium' : 'text-white hover:text-yellow-300'
              }
            >
              Register
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

