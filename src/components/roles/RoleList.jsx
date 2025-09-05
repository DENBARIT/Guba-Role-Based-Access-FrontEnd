import React from 'react'
export default function RoleList({ roles=[], onEdit, onDelete, onView }){
  return (
    <div className="bg-white border rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Description</th><th className="p-2">Actions</th></tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.description || '-'}</td>
              <td className="p-2 text-right space-x-2">
                {/* <button onClick={()=>onView(r)} className="px-2 py-1 border rounded">View</button>
                <button onClick={()=>onEdit(r)} className="px-2 py-1 border rounded">Edit</button>
                <button onClick={()=>onDelete(r)} className="px-2 py-1 border rounded text-red-600">Delete</button> */}
            <button onClick={() => onView(r)} className="px-2 py-1 bg-blue-500 text-white rounded">View</button>
                <button onClick={() => onEdit(r)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => onDelete(r)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
            
              </td>
            </tr>
          ))}
          {roles.length===0 && (<tr><td className="p-3 text-center text-gray-500" colSpan="3">No roles</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
