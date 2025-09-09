// // import React, { useEffect, useState } from 'react'
// // import { getRole, assignPermissionToRole, removePermissionFromRole } from '../../services/roleService.js'
// // import { getPermissions } from '../../services/permissionService.js'
// // import Modal from '../ui/Modal.jsx'

// // export default function RoleDetails({ role, refreshRoles }){
// //   const [details, setDetails] = useState(role)
// //   const [loading, setLoading] = useState(false)
// //   const [available, setAvailable] = useState([])
// //   const [assignModal, setAssignModal] = useState(false)
// //   const [selectedPermission, setSelectedPermission] = useState('')

// //   async function load(){
// //     try { setLoading(true); const full = await getRole(role.id); setDetails(full) }
// //     catch(err){ console.error('load role', err) } finally { setLoading(false) }
// //   }
// //   async function loadPermissions(){ try { setAvailable(await getPermissions()) } catch(err){ console.error('load perms', err) } }

// //   useEffect(()=>{ load(); loadPermissions() },[role?.id])

// //   async function onAssign(){
// //     if (!selectedPermission) return alert('Select a permission')
// //     try { await assignPermissionToRole(details.id, selectedPermission); setAssignModal(false); setSelectedPermission(''); await load(); if (refreshRoles) refreshRoles() } catch(err){ console.error(err); alert('Failed to assign permission') }
// //   }
// //   async function onRemove(pid){
// //     if (!confirm('Remove permission from role?')) return
// //     try { await removePermissionFromRole(details.id, pid); await load(); if (refreshRoles) refreshRoles() } catch(err){ console.error(err); alert('Failed to remove permission') }
// //   }
// //   const assignedIds = (details.permissions || []).map(p => p.id)

// //   return (
// //     <div className="border rounded p-4 bg-white shadow">
// //       <h2 className="text-lg font-medium mb-2">Role Details</h2>
// //       {loading ? <div>Loading…</div> : (
// //         <>
// //           <div className="text-sm text-gray-700 mb-4">
// //             <div><strong>Name:</strong> {details.name}</div>
// //             <div><strong>Description:</strong> {details.description || '-'}</div>
// //           </div>
// //           <div className="mb-3">
// //             <h3 className="font-medium">Assigned Permissions</h3>
// //             <div className="space-y-2 mt-2">
// //               {(details.permissions || []).length === 0 ? (
// //                 <div className="text-sm text-gray-500">No permissions assigned</div>
// //               ) : (
// //                 details.permissions.map(p => (
// //                   <div key={p.id} className="flex items-center justify-between border rounded px-2 py-1">

// //                     <div>{p.name}</div>
// //                     <h1>{p.name}</h1>
// //                     <button onClick={()=>onRemove(p.id)} className="text-sm text-red-600">Remove</button>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           </div>
// //           <div><button onClick={()=>setAssignModal(true)} className="px-3 py-1 border rounded">Assign Permission</button></div>
// //           <Modal open={assignModal} title="Assign Permission" onClose={()=>setAssignModal(false)}>
// //             <div className="space-y-3">
// //               <div>
// //                 <label className="block text-sm mb-1">Select permission</label>
// //                 <select value={selectedPermission} onChange={e=>setSelectedPermission(e.target.value)} className="w-full border rounded px-2 py-1">
// //                   <option value="">-- choose --</option>
// //                   {available.filter(p=>!assignedIds.includes(p.id)).map(p => <option key={p.id} value={p.id}>{p.name}{p.description ? ` - ${p.description}` : ''}</option>)}
// //                 </select>
// //               </div>
// //               <div className="flex justify-end gap-2 pt-2">
// //                 <button className="px-3 py-1 border rounded" onClick={()=>setAssignModal(false)}>Cancel</button>
// //                 <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={onAssign}>Assign</button>
// //               </div>
// //             </div>
// //           </Modal>
// //         </>
// //       )}
// //     </div>
// //   )
// // }

// import React, { useEffect, useState } from "react";
// import {
//   getRole,
//   assignPermissionToRole,
//   removePermissionFromRole,
// } from "../../services/roleService.js";
// import { getPermissions } from "../../services/permissionService.js";
// import Modal from "../ui/Modal.jsx";

// export default function RoleDetails({ role, refreshRoles }) {
//   const [details, setDetails] = useState(role);
//   const [loading, setLoading] = useState(false);
//   const [available, setAvailable] = useState([]);
//   const [assignModal, setAssignModal] = useState(false);
//   const [selectedPermissions, setSelectedPermissions] = useState([]); // To track selected permissions
//   const [permissionsToRemove, setPermissionsToRemove] = useState([]); // Track permissions to be removed

//   async function load() {
//     try {
//       setLoading(true);
//       const full = await getRole(role.id);
//       setDetails(full);
//     } catch (err) {
//       console.error("load role", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function loadPermissions() {
//     try {
//       setAvailable(await getPermissions());
//     } catch (err) {
//       console.error("load perms", err);
//     }
//   }

//   useEffect(() => {
//     load();
//     loadPermissions();
//   }, [role?.id]);

//   async function onAssign() {
//     if (selectedPermissions.length === 0)
//       return alert("Select at least one permission");
//     try {
//       // Assign selected permissions to the role
//       for (const permissionId of selectedPermissions) {
//         await assignPermissionToRole(details.id, permissionId);
//       }
//       setAssignModal(false);
//       setSelectedPermissions([]);
//       await load();
//       if (refreshRoles) refreshRoles();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign permissions");
//     }
//   }

//   async function onRemove() {
//     if (permissionsToRemove.length === 0)
//       return alert("Select at least one permission to remove");
//     try {
//       // Remove selected permissions from the role
//       for (const permissionId of permissionsToRemove) {
//         await removePermissionFromRole(details.id, permissionId);
//       }
//       setPermissionsToRemove([]);
//       await load();
//       if (refreshRoles) refreshRoles();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove permissions");
//     }
//   }

//   const assignedIds = (details.permissions || []).map((p) => p.id);

//   const handleCheckboxChange = (permissionId) => {
//     setSelectedPermissions((prev) => {
//       if (prev.includes(permissionId)) {
//         return prev.filter((id) => id !== permissionId);
//       } else {
//         return [...prev, permissionId];
//       }
//     });
//   };

//   const handleRemoveCheckboxChange = (permissionId) => {
//     setPermissionsToRemove((prev) => {
//       if (prev.includes(permissionId)) {
//         return prev.filter((id) => id !== permissionId);
//       } else {
//         return [...prev, permissionId];
//       }
//     });
//   };

//   return (
//     <div className="border rounded p-4 bg-white shadow">
//       <h2 className="text-lg font-medium mb-2">Role Details</h2>
//       {loading ? (
//         <div>Loading…</div>
//       ) : (
//         <>
//           <div className="text-sm text-gray-700 mb-4">
//             <div>
//               <strong>Name:</strong> {details.name}
//             </div>
//             <div>
//               <strong>Description:</strong> {details.description || "-"}
//             </div>
//           </div>
//           <div className="mb-3">
//             <h3 className="font-medium">Assigned Permissions</h3>
//             <div className="space-y-2 mt-2">
//               {(details.permissions || []).length === 0 ? (
//                 <div className="text-sm text-gray-500">
//                   No permissions assigned
//                 </div>
//               ) : (
//                 details.permissions.map((p) => (
//                   <div
//                     key={p.id}
//                     className="flex items-center border rounded px-2 py-1"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={permissionsToRemove.includes(p.id)}
//                       onChange={() => handleRemoveCheckboxChange(p.id)}
//                       className="mr-2"
//                     />
//                     <div>{p.name}</div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <div>
//             <button
//               onClick={onRemove}
//               className="px-3 py-1 bg-red-600 text-white rounded mr-2"
//             >
//               Remove Selected Permissions
//             </button>
//             <button
//               onClick={() => setAssignModal(true)}
//               className="px-3 py-1 border rounded"
//             >
//               Assign Permission
//             </button>
//           </div>

//           <Modal
//             open={assignModal}
//             title="Assign Permission"
//             onClose={() => setAssignModal(false)}
//           >
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm mb-1">Select permissions</label>
//                 <div className="space-y-2">
//                   {available
//                     .filter((p) => !assignedIds.includes(p.id))
//                     .map((p) => (
//                       <div key={p.id} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id={`permission-${p.id}`}
//                           checked={selectedPermissions.includes(p.id)}
//                           onChange={() => handleCheckboxChange(p.id)}
//                           className="mr-2"
//                         />
//                         <label
//                           htmlFor={`permission-${p.id}`}
//                           className="text-sm"
//                         >
//                           {p.name}
//                           {p.description ? ` - ${p.description}` : ""}
//                         </label>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   className="px-3 py-1 border rounded"
//                   onClick={() => setAssignModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-3 py-1 bg-blue-600 text-white rounded"
//                   onClick={onAssign}
//                 >
//                   Assign
//                 </button>
//               </div>
//             </div>
//           </Modal>
//         </>
//       )}
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import {
//   getRole,
//   assignPermissionToRole,
//   removePermissionFromRole,
// } from "../../services/roleService.js";
// import { getPermissions } from "../../services/permissionService.js";
// import Modal from "../ui/Modal.jsx";

// export default function RoleDetails({ role, refreshRoles }) {
//   const [details, setDetails] = useState(role);
//   const [loading, setLoading] = useState(false);
//   const [available, setAvailable] = useState([]); // Permissions available to assign
//   const [permissionsToAdd, setPermissionsToAdd] = useState([]); // Permissions to add
//   const [permissionsToRemove, setPermissionsToRemove] = useState([]); // Permissions to remove
//   const [editing, setEditing] = useState(false); // Track whether the user is editing

//   async function load() {
//     try {
//       setLoading(true);
//       const full = await getRole(role.id);
//       setDetails(full);
//     } catch (err) {
//       console.error("load role", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function loadPermissions() {
//     try {
//       setAvailable(await getPermissions());
//     } catch (err) {
//       console.error("load perms", err);
//     }
//   }

//   useEffect(() => {
//     load();
//     loadPermissions();
//   }, [role?.id]);

//   const assignedIds = (details.permissions || []).map((p) => p.id);

//   const handleCheckboxChange = (permissionId, action) => {
//     if (action === "add") {
//       setPermissionsToAdd((prev) => {
//         if (prev.includes(permissionId)) {
//           return prev.filter((id) => id !== permissionId);
//         } else {
//           return [...prev, permissionId];
//         }
//       });
//     } else if (action === "remove") {
//       setPermissionsToRemove((prev) => {
//         if (prev.includes(permissionId)) {
//           return prev.filter((id) => id !== permissionId);
//         } else {
//           return [...prev, permissionId];
//         }
//       });
//     }
//   };

//   // Save the permissions (add/remove)
//   async function onSave() {
//     try {
//       // Remove permissions that were checked for removal
//       for (const permissionId of permissionsToRemove) {
//         await removePermissionFromRole(details.id, permissionId);
//       }

//       // Add permissions that were checked for addition
//       for (const permissionId of permissionsToAdd) {
//         await assignPermissionToRole(details.id, permissionId);
//       }

//       setPermissionsToAdd([]);
//       setPermissionsToRemove([]);
//       setEditing(false);
//       await load();
//       if (refreshRoles) refreshRoles();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update permissions");
//     }
//   }

//   // Cancel editing, reset checkboxes
//   const onCancel = () => {
//     setPermissionsToAdd([]);
//     setPermissionsToRemove([]);
//     setEditing(false);
//   };

//   return (
//     <div className="border rounded p-4 bg-white shadow">
//       <h2 className="text-lg font-medium mb-2">Role Details</h2>
//       {loading ? (
//         <div>Loading…</div>
//       ) : (
//         <>
//           <div className="text-sm text-gray-700 mb-4">
//             <div>
//               <strong>Name:</strong> {details.name}
//             </div>
//             <div>
//               <strong>Description:</strong> {details.description || "-"}
//             </div>
//           </div>

//           <div className="mb-3">
//             <h3 className="font-medium">Permissions</h3>
//             <div className="space-y-2 mt-2">
//               {(details.permissions || []).length === 0 ? (
//                 <div className="text-sm text-gray-500">
//                   No permissions assigned
//                 </div>
//               ) : (
//                 details.permissions.map((p) => (
//                   <div
//                     key={p.id}
//                     className="flex items-center border rounded px-2 py-1"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={permissionsToRemove.includes(p.id)}
//                       onChange={() => handleCheckboxChange(p.id, "remove")}
//                       className="mr-2"
//                     />
//                     <div>{p.name}</div>
//                   </div>
//                 ))
//               )}
//               {/* Permissions available to add */}
//               {available
//                 .filter((p) => !assignedIds.includes(p.id))
//                 .map((p) => (
//                   <div
//                     key={p.id}
//                     className="flex items-center border rounded px-2 py-1"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={permissionsToAdd.includes(p.id)}
//                       onChange={() => handleCheckboxChange(p.id, "add")}
//                       className="mr-2"
//                     />
//                     <div>{p.name}</div>
//                   </div>
//                 ))}
//             </div>
//           </div>

//           {editing ? (
//             <div className="flex justify-end gap-2 pt-2">
//               <button className="px-3 py-1 border rounded" onClick={onCancel}>
//                 Cancel
//               </button>
//               <button
//                 className="px-3 py-1 bg-blue-600 text-white rounded"
//                 onClick={onSave}
//               >
//                 Save Changes
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setEditing(true)}
//               className="px-3 py-1 bg-blue-600 text-white rounded"
//             >
//               Edit Permissions
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  getRole,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../../services/roleService.js";
import { getPermissions } from "../../services/permissionService.js";

export default function RoleDetails({ role, refreshRoles }) {
  const [details, setDetails] = useState(role);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState([]); // Track currently checked permissions

  async function load() {
    try {
      setLoading(true);
      const full = await getRole(role.id);
      setDetails(full);
      setSelected((full.permissions || []).map((p) => p.id)); // preload assigned
    } catch (err) {
      console.error("load role", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPermissions() {
    try {
      setAvailable(await getPermissions());
    } catch (err) {
      console.error("load perms", err);
    }
  }

  useEffect(() => {
    load();
    loadPermissions();
  }, [role?.id]);

  const handleCheckboxChange = (permissionId) => {
    setSelected((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  async function onSave() {
    try {
      const currentAssigned = (details.permissions || []).map((p) => p.id);

      // permissions to add = selected - currentAssigned
      const toAdd = selected.filter((id) => !currentAssigned.includes(id));
      // permissions to remove = currentAssigned - selected
      const toRemove = currentAssigned.filter((id) => !selected.includes(id));

      for (const permissionId of toAdd) {
        await assignPermissionToRole(details.id, permissionId);
      }
      for (const permissionId of toRemove) {
        await removePermissionFromRole(details.id, permissionId);
      }

      await load();
      if (refreshRoles) refreshRoles();
      alert("Permissions updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update permissions");
    }
  }

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h2 className="text-lg font-medium mb-2">Role Details</h2>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="text-sm text-gray-700 mb-4">
            <div>
              <strong>Name:</strong> {details.name}
            </div>
            <div>
              <strong>Description:</strong> {details.description || "-"}
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-medium">Permissions</h3>
            <div className="space-y-2 mt-2">
              {available.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center border rounded px-2 py-1"
                >
                  <input
                    type="checkbox"
                    id={`perm-${p.id}`}
                    checked={selected.includes(p.id)}
                    onChange={() => handleCheckboxChange(p.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`perm-${p.id}`} className="text-sm">
                    {p.name}
                    {p.description ? ` - ${p.description}` : ""}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onSave}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
