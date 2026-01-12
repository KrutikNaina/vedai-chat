import axios from "axios";

const PROGRESS_BASE = "http://localhost:5000/api/ekatha-progress";

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
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
