
import api from '../api/apiClient.js'
const base = '/Permission'

function mapPermission(p){
  return {
    id: p.id || p.Id,
    name: p.name || p.Name,
    description: p.description || p.Description
  }
}

export async function getPermissions(){
  const res = await api.get(base)
  const data = res.data || []
  return Array.isArray(data) ? data.map(mapPermission) : mapPermission(data)
}
export async function getPermission(id){ const res = await api.get(`${base}/${id}`); return mapPermission(res.data) }

// CreatePermissionDto expects Name, Description
export async function createPermission(payload){
  const body = { Name: payload.name || payload.Name, Description: payload.description || payload.Description }
  const res = await api.post(base, body)
  return mapPermission(res.data)
}
export async function updatePermission(id, payload){
  const body = { Name: payload.name || payload.Name, Description: payload.description || payload.Description }
  const res = await api.put(`${base}/${id}`, body)
  return mapPermission(res.data)
}
export async function deletePermission(id){ await api.delete(`${base}/${id}`) }
