
import React, { useState, useEffect } from 'react'

export default function PermissionForm({ initial=null, onCancel, onSubmit }){
  const [values, setValues] = useState({ name:'', description:'' })
  useEffect(()=>{ if (initial) setValues({ name: initial.name || '', description: initial.description || '' }) },[initial])
  const update = (f,v)=>setValues(s=>({ ...s, [f]: v }))
  const submit = (e)=>{ e.preventDefault(); onSubmit(values) }
  return (
    <div className="bg-white border rounded shadow p-4">
      <h2 className="text-lg font-medium mb-3">{initial ? 'Edit Permission' : 'Create Permission'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input value={values.name} onChange={e=>update('name', e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea value={values.description} onChange={e=>update('description', e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="flex gap-2 pt-3">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}
