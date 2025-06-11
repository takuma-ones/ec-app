// lib/axios.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot のAPIルート
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookieが必要な場合
})

export default instance
