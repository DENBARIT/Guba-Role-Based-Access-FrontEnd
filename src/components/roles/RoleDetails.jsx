import React, { useEffect, useState } from 'react'
import { getRole, assignPermissionToRole, removePermissionFromRole } from '../../services/roleService.js'
import { getPermissions } from '../../services/permissionService.js'
import Modal from '../ui/Modal.jsx'

export default function RoleDetails({ role, refreshRoles }){
  const [details, setDetails] = useState(role)
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState([])
  const [assignModal, setAssignModal] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState('')

  async function load(){
    try { setLoading(true); const full = await getRole(role.id); setDetails(full) }
    catch(err){ console.error('load role', err) } finally { setLoading(false) }
  }
  async function loadPermissions(){ try { setAvailable(await getPermissions()) } catch(err){ console.error('load perms', err) } }

  useEffect(()=>{ load(); loadPermissions() },[role?.id])

  async function onAssign(){
    if (!selectedPermission) return alert('Select a permission')
    try { await assignPermissionToRole(details.id, selectedPermission); setAssignModal(false); setSelectedPermission(''); await load(); if (refreshRoles) refreshRoles() } catch(err){ console.error(err); alert('Failed to assign permission') }
  }
  async function onRemove(pid){
    if (!confirm('Remove permission from role?')) return
    try { await removePermissionFromRole(details.id, pid); await load(); if (refreshRoles) refreshRoles() } catch(err){ console.error(err); alert('Failed to remove permission') }
  }
  const assignedIds = (details.permissions || []).map(p => p.id)

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h2 className="text-lg font-medium mb-2">Role Details</h2>
      {loading ? <div>Loading…</div> : (
        <>
          <div className="text-sm text-gray-700 mb-4">
            <div><strong>Name:</strong> {details.name}</div>
            <div><strong>Description:</strong> {details.description || '-'}</div>
          </div>
          <div className="mb-3">
            <h3 className="font-medium">Assigned Permissions</h3>
            <div className="space-y-2 mt-2">
              {(details.permissions || []).length === 0 ? (
                <div className="text-sm text-gray-500">No permissions assigned</div>
              ) : (
                details.permissions.map(p => (
                  <div key={p.id} className="flex items-center justify-between border rounded px-2 py-1">

                    <div>{p.name}</div>
                    <h1>{p.name}</h1>
                    <button onClick={()=>onRemove(p.id)} className="text-sm text-red-600">Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div><button onClick={()=>setAssignModal(true)} className="px-3 py-1 border rounded">Assign Permission</button></div>
          <Modal open={assignModal} title="Assign Permission" onClose={()=>setAssignModal(false)}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Select permission</label>
                <select value={selectedPermission} onChange={e=>setSelectedPermission(e.target.value)} className="w-full border rounded px-2 py-1">
                  <option value="">-- choose --</option>
                  {available.filter(p=>!assignedIds.includes(p.id)).map(p => <option key={p.id} value={p.id}>{p.name}{p.description ? ` - ${p.description}` : ''}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3 py-1 border rounded" onClick={()=>setAssignModal(false)}>Cancel</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={onAssign}>Assign</button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
