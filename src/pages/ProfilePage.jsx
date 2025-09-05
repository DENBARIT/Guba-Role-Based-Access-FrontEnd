import React, { useEffect, useState } from 'react'
import { getProfile } from '../services/userService.js'
import { useAuth } from '../context/AuthContext.jsx'

// const user = await getProfile()

export default function ProfilePage(){
  const { user: cached, setUser } = useAuth()
  const [user, setLocal] = useState(cached)
  const [loading, setLoading] = useState(!cached)



  useEffect(() => {
  let mounted = true; // prevent setting state if component unmounts
  (async () => {
    try {
      const me = await getProfile();
      const profile = me.user ?? me; // support both response shapes
      if (mounted && profile) {
        setLocal(profile);   // update local state
        setUser(profile);    // update AuthContext if needed
      }
    } catch (e) {
      console.error('profile load', e);
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => { mounted = false }; // cleanup
}, []);

   if (loading) return <div className="p-6">Loading…</div>
  if (!user)   return <div className="p-6">No profile available.</div>

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="space-y-2">
        <div><span className="text-gray-500">Username:</span> {user.username}</div>
        <div><span className="text-gray-500">Email:</span> {user.email}</div>
        <div><span className="text-gray-500">Roles:</span> {(user.roles||[]).join(', ')}</div>
        <div><span className="text-gray-500">Permissions:</span> {(user.permissions||[]).join(', ')}</div>
        <div><span className="text-gray-500">Active:</span> {String(user.isActive ?? true)}</div>
      </div>
    </div>
  )
}
