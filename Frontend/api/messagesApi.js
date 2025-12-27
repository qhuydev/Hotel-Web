import axiosClient from './axiosClient'

const messagesApi = {
  getTemplates: () => axiosClient.get('/messages/templates'),
  createTemplate: (data) => axiosClient.post('/messages/templates', data),
  updateTemplate: (id, data) => axiosClient.put(`/messages/templates/${id}`, data),
  deleteTemplate: (id) => axiosClient.delete(`/messages/templates/${id}`),
  getLogs: (params) => axiosClient.get('/messages/logs', { params }),
  getMy: (params) => axiosClient.get('/messages/my', { params }),
  send: (data) => axiosClient.post('/messages/send', data),
  // conversation
  sendMessage: (data) => axiosClient.post('/messages/send', data),
  getConversation: (otherUserId) => axiosClient.get(`/messages/conversation/${otherUserId}`),
  markRead: (otherUserId) => axiosClient.put(`/messages/conversation/${otherUserId}/read`),
  deleteMessage: (id) => axiosClient.delete(`/messages/${id}`),
  getAdmin: () => axiosClient.get('/messages/admin'),
}

export default messagesApi
