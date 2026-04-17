import api from './axios';


export const getRolesRequest = async () => {
  const response = await api.get('/roles');
  return response.data;
};

export const createRoleRequest = async (roleData) => {
  const response = await api.post('/roles', roleData);
  return response.data;
};

export const updateRoleRequest = async (id, roleData) => {
  const response = await api.put(`/roles/${id}`, roleData);
  return response.data;
};

export const deleteRoleRequest = async (id) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};