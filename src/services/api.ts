import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'https://api-gerencia-solicitacao-tcc.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api };
