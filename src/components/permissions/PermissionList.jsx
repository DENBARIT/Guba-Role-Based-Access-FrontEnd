import React from 'react'
export default function PermissionList({ permissions=[], onEdit, onDelete, onView }){
  return (
    <div className="bg-white border rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Description</th><th className="p-2">Actions</th></tr>
        </thead>
        <tbody>
          {permissions.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.description || '-'}</td>
              <td className="p-2 text-right space-x-2">
               
                <button onClick={() => onView(p)} className="px-2 py-1 bg-blue-500 text-white rounded">View</button>
                <button onClick={() => onEdit(p)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => onDelete(p)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
          {permissions.length===0 && (<tr><td className="p-3 text-center text-gray-500" colSpan="3">No permissions</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
