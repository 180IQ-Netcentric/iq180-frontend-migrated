import { getCookie } from '../utils/cookie'
import Axios from 'axios'

type UrlType = string | undefined

export const client = Axios.create({
  baseURL:
    (process.env.REACT_APP_APP_API_URL as UrlType) || 'http://localhost:3001',
})
client.interceptors.request.use(
  (req) => {
    if (req.headers && !req.headers['x-access-token']) {
      const token = getCookie('token')
      // to be checked
      // req.headers.Authorization = `Bearer ${token}`
      req.headers = {
        ...req.headers,
        'x-access-token': token ?? '',
      }
      return req
    } else return req
  },
  (error) => Promise.reject(error)
)

export const randomNameClient = Axios.create({
  baseURL: 'https://randommer.io/api/',
})
randomNameClient.interceptors.request.use(
  (req) => {
    if (req.headers && !req.headers['X-Api-Key']) {
      req.headers = {
        ...req.headers,
        'X-Api-Key': '876b65c3657a43dea7b1a1868ba6ee78',
      }
    }
    return req
  },
  (error) => Promise.reject(error)
)
