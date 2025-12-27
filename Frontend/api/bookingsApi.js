import axiosClient from './axiosClient.js'

const bookingsApi = {
  create: (data) => axiosClient.post('/bookings', data),
  getMy: () => axiosClient.get('/bookings/my'),
  getAll: () => axiosClient.get('/bookings'),
  confirm: (id) => axiosClient.patch(`/bookings/${id}/confirm`),
  counts: () => axiosClient.get('/bookings/counts'),
  remove: (id) => axiosClient.delete(`/bookings/${id}`),
}

export default bookingsApi
