import axios from "axios";

const API_BASE = "http://localhost:5000/api/ekatha";

export const fetchKathas = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const fetchKathaById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};
