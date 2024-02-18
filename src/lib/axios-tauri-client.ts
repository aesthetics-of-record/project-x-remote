import axios from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';

export const axiosClient = axios.create({ adapter: axiosTauriApiAdapter });
