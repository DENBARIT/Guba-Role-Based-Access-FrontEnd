
import api from '../api/apiClient.js'
const base = '/Role'

function mapRole(r){
  return {
    id: r.id || r.Id,
    name: r.name || r.Name,
    description: r.description || r.Description,
    permissions: r.permissions || r.Permissions || []
  }
}

export async function getRoles(){
  const res = await api.get(base)
  const data = res.data || []
  return Array.isArray(data) ? data.map(mapRole) : mapRole(data)
}
export async function getRole(id){ const res = await api.get(`${base}/${id}`); return mapRole(res.data) }

// Backend CreateRoleDto expects Name, Description
export async function createRole(payload){
  const body = { Name: payload.name || payload.Name, Description: payload.description || payload.Description }
  const res = await api.post(base, body)
  return mapRole(res.data)
}
export async function updateRole(id, payload){
  const body = { Name: payload.name || payload.Name, Description: payload.description || payload.Description }
  const res = await api.put(`${base}/${id}`, body)
  return mapRole(res.data)
}
export async function deleteRole(id){ await api.delete(`${base}/${id}`) }

// permission assignment endpoints
export async function assignPermissionToRole(roleId, permissionId){ return (await api.post(`${base}/${roleId}/permissions/${permissionId}`)).data }
export async function removePermissionFromRole(roleId, permissionId){ return (await api.delete(`${base}/${roleId}/permissions/${permissionId}`)).data }
