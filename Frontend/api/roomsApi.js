import axiosClient from './axiosClient.js'

const roomsApi = {
  list: () => axiosClient.get('/rooms'),
  create: (data) => {
    if (data instanceof FormData) return axiosClient.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    return axiosClient.post('/rooms', data)
  },
  update: (id, data) => {
    if (data instanceof FormData) return axiosClient.put(`/rooms/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    return axiosClient.put(`/rooms/${id}`, data)
  },
  remove: (id) => axiosClient.delete(`/rooms/${id}`),
}

export default roomsApi
