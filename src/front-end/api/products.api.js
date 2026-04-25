import api from '../api/axios';

export const getProductsRequest = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProductRequest = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductRequest = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductRequest = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};