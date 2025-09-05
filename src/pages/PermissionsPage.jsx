
import React, { useEffect, useState, useMemo } from 'react'
import { getPermissions, createPermission, updatePermission, deletePermission } from '../services/permissionService.js'
import PermissionList from '../components/permissions/PermissionList.jsx'
import PermissionForm from '../components/permissions/PermissionForm.jsx'
import PermissionDetails from '../components/permissions/PermissionDetails.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function PermissionsPage() {
  const { hasPermission, hasRole } = useAuth()

  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('') //  Search state

  // Load permissions only if user has the required permission or is Admin
  async function load() {
    if (!hasPermission('permissions.manage') && !hasRole('Admin')) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const data = await getPermissions()
      setItems(data)
    } catch (err) {
      console.error(err)
      alert('Failed to load permissions: ' + (err?.response?.data?.message || err?.message || 'Network Error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Handlers
  function onCreate() {
    setSelected(null)
    setEditing(false)
    setShowForm(true)
  }

  function onView(item) {
    setSelected(item)
    setEditing(false)
    setShowForm(false)
  }

  function onEdit(item) {
    setSelected(item)
    setEditing(true)
    setShowForm(true)
  }

  async function onDelete(item) {
    if (!confirm(`Delete permission ${item.name}?`)) return
    try {
      await deletePermission(item.id)
      await load()
      setSelected(null)
    } catch (err) {
      console.error(err)
      alert('Delete failed: ' + (err?.response?.data?.message || err?.message || 'Unknown'))
    }
  }

  async function onSubmit(values) {
    try {
      if (editing && selected) {
        await updatePermission(selected.id, { name: values.name, description: values.description })
        alert('Permission updated')
      } else {
        await createPermission({ name: values.name, description: values.description })
        alert('Permission created')
      }
      setShowForm(false)
      setEditing(false)
      setSelected(null)
      await load()
    } catch (err) {
      console.error(err)
      alert('Failed saving permission: ' + (err?.response?.data?.message || err?.message || 'Unknown'))
    }
  }

  // Filter permissions by search term
  const filteredItems = useMemo(() => {
    return items.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [items, searchTerm])

  if (loading) {
    return <div className="p-4 text-gray-600">Loading permissions...</div>
  }

  // Guard: show message if user lacks permission
  if (!hasPermission('permissions.manage') && !hasRole('Admin')) {
    return (
      <div className="p-4 text-gray-600">
        You do not have permission to view or manage permissions.
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <button onClick={onCreate} className="px-3 py-2 bg-blue-600 text-white rounded">
         +Create Permission
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search permissions by name or description"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PermissionList
            permissions={filteredItems}  //  pass filtered list
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </div>
        <div className="col-span-1">
          {showForm ? (
            <PermissionForm
              initial={editing ? selected : null}
              onCancel={() => {
                setShowForm(false)
                setEditing(false)
                setSelected(null)
              }}
              onSubmit={onSubmit}
            />
          ) : selected ? (
            <PermissionDetails permission={selected} />
          ) : (
            <div className="border rounded p-4 text-gray-600 bg-white shadow">
              Select a permission to see details or click Create Permission.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
