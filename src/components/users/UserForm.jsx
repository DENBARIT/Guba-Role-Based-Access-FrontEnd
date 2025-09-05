

import React, { useState, useEffect } from 'react'

export default function UserForm({ initial=null, onCancel, onSubmit, roles=[] }){
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    isActive: true,
    roles: [],
    avatarFile: null,   
  })

  const [preview, setPreview] = useState(null) 

  useEffect(() => {
    if (initial) {
      setValues({
        username: initial.username || '',
        email: initial.email || '',
        password: '',
        isActive: !!initial.isActive,
        roles: Array.isArray(initial.roles)
          ? initial.roles
              .map(r => {
                const roleObj = roles.find(x => x.id === r || x.name === r)
                return roleObj ? roleObj.id : null
              })
              .filter(Boolean)
          : [],
        avatarFile: null,
      })
      setPreview(
        initial.avatarUrl
          ? (initial.avatarUrl.startsWith('http') ? initial.avatarUrl : `https://localhost:5001${initial.avatarUrl}`)
          : null
      )
    } else {
      setValues({
        username: '',
        email: '',
        password: '',
        isActive: true,
        roles: [],
        avatarFile: null,
      })
      setPreview(null)
    }
  }, [initial, roles])

  const update = (field, value) => setValues(s => ({ ...s, [field]: value }))

  const toggleRole = (id) => {
    setValues(s => ({
      ...s,
      roles: s.roles.includes(id) ? s.roles.filter(x => x !== id) : [...s.roles, id]
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    update('avatarFile', file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const submit = (e) => {
    e.preventDefault()
    onSubmit(values)  
  }

  return (
    <div className="bg-white border rounded shadow p-4">
      <h2 className="text-lg font-medium mb-3">{initial ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={submit} className="space-y-3">
        
        {/* Avatar upload */}
        <div>
          <label className="block text-sm mb-1">Profile Image</label>
          {preview ? (
            <img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">?</div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Existing fields untouched */}
        <div>
          <label className="block text-sm">Username</label>
          <input
            value={values.username}
            onChange={e => update('username', e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input value={values.email} onChange={e=>update('email', e.target.value)} required type="email" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Password {initial ? '(leave blank to keep current)' : ''}</label>
          <input value={values.password} onChange={e=>update('password', e.target.value)} type="password" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={!!values.isActive} onChange={e=>update('isActive', e.target.checked)} />
            <span className="ml-2">Active</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Roles</label>
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            {roles.map(r => (
              <label key={r.id} className="inline-flex items-center">
                <input type="checkbox" checked={values.roles.includes(r.id)} onChange={()=>toggleRole(r.id)} />
                <span className="ml-2">{r.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}
