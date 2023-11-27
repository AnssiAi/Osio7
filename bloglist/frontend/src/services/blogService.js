import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export const createNew = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export const commentBlog = async ({ id, comment }) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment)
  return response.data
}

export const updateBlog = async (newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return response.data
}

export const removeBlog = async (object) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${object.id}`, config)
  return response.status
}

