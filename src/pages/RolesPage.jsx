
import React, { useEffect, useState, useMemo } from 'react'
import { getRoles, createRole, updateRole, deleteRole } from '../services/roleService.js'
import RoleList from '../components/roles/RoleList.jsx'
import RoleForm from '../components/roles/RoleForm.jsx'
import RoleDetails from '../components/roles/RoleDetails.jsx'

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(false)

  const [searchTerm, setSearchTerm] = useState('') // search state

  async function loadRoles() {
    try {
      setRoles(await getRoles())
    } catch (err) {
      console.error(err)
      alert('Failed to load roles: ' + (err?.response?.data?.message || err?.message || 'Unknown'))
    }
  }

  useEffect(() => { loadRoles() }, [])

  function onCreate() { setSelected(null); setEditing(false); setShowForm(true) }
  function onView(r) { setSelected(r); setShowForm(false); setEditing(false) }
  function onEdit(r) { setSelected(r); setEditing(true); setShowForm(true) }

  async function onDelete(r) {
    if (!confirm('Delete role ' + r.name + '?')) return
    try { 
      await deleteRole(r.id) 
      await loadRoles() 
      setSelected(null) 
    } catch (err) { 
      console.error(err); 
      alert('Delete failed: ' + (err?.response?.data?.message || err?.message || 'Unknown')) 
    }
  }

  async function onSubmitForm(values) {
    try {
      if (editing && selected) {
        await updateRole(selected.id, { name: values.name, description: values.description })
        alert('Role updated')
      } else {
        await createRole({ name: values.name, description: values.description })
        alert('Role created')
      }
      setShowForm(false); setEditing(false); setSelected(null)
      await loadRoles()
    } catch (err) {
      console.error(err)
      alert('Failed saving role: ' + (err?.response?.data?.message || err?.message || 'Unknown'))
    }
  }

  // Filter roles by search term
  const filteredRoles = useMemo(() => {
    return roles.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [roles, searchTerm])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <button onClick={onCreate} className="px-3 py-2 bg-blue-600 text-white rounded">+Create Role</button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search roles by name or description"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RoleList roles={filteredRoles} onEdit={onEdit} onDelete={onDelete} onView={onView} />
        </div>
        <div className="col-span-1">
          { showForm ? (
            <RoleForm 
              initial={editing ? selected : null} 
              onCancel={() => { setShowForm(false); setEditing(false); setSelected(null) }} 
              onSubmit={onSubmitForm} 
            />
          ) : selected ? (
            <RoleDetails role={selected} />
          ) : (
            <div className="border rounded p-4 text-gray-600 bg-white shadow">
              Select a role to see details or click Create Role.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
