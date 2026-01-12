// vedai-landing\src\api\ekathaApi.jsx
import axios from "axios";

const API_BASE = "http://localhost:5000/api/ekatha";
const PROGRESS_BASE = "http://localhost:5000/api/ekatha-progress";

// Helper to get headers with token
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Fetch all Kathas (public)
export const fetchKathas = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

// Fetch single Katha by ID (public)
export const fetchKathaById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

// Save progress (requires JWT token)
export const saveProgress = async (kathaId, currentStep, token) => {
  if (!token) throw new Error("No token provided for saveProgress");
  const res = await axios.post(
    `${PROGRESS_BASE}/save/${kathaId}`,
    { currentStep },
    getAuthHeaders(token)
  );
  return res.data;
};

// Get user progress (requires JWT token)
export const getProgress = async (kathaId, token) => {
  if (!token) throw new Error("No token provided for getProgress");
  const res = await axios.get(`${PROGRESS_BASE}/get/${kathaId}`, getAuthHeaders(token));
  return res.data;
};
