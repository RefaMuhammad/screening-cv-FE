import axios from 'axios';
import { JobRequirement, ScreeningResponse } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api';

export const checkOcrStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/ocr/status`);
  return response.data;
};

export const polishRoleDescription = async (text: string) => {
  const response = await axios.post(`${API_BASE_URL}/job/polish`, { text });
  return response.data;
};

export const screenBatch = async (jobReq: JobRequirement, files: File[]): Promise<ScreeningResponse> => {
  const formData = new FormData();
  
  formData.append('job_requirement', JSON.stringify(jobReq));
  
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await axios.post(`${API_BASE_URL}/screen/batch`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
