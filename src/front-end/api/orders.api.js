import api from './axios';

export const getOrdersRequest = async () => {
  const response = await api.get('/orders');
  return response.data;
};


// export const createOrderRequest = async (orderData) => {
//   const response = await api.post('/orders/submit', orderData);
//   return response.data;
// };
