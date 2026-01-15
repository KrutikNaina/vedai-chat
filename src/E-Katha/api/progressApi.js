// vedai-landing/src/E-Katha/api/progressApi.js
import axios from "axios";

const PROGRESS_BASE = `${import.meta.env.VITE_API_URL}/api/ekatha-progress`;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const saveProgress = async (kathaId, currentStep, token) => {
  const res = await axios.post(
    `${PROGRESS_BASE}/save/${kathaId}`,
    { currentStep },
    getAuthHeaders(token)
  );
  return res.data;
};

export const getProgress = async (kathaId, token) => {
  const res = await axios.get(
    `${PROGRESS_BASE}/get/${kathaId}`,
    getAuthHeaders(token)
  );
  return res.data;
};
