// vedai-landing/src/E-Katha/api/ekathaApi.js
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/ekatha`;

export const fetchKathas = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const fetchKathaById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};
