import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const triggerAudit = async (url) => {
  const response = await api.post("/audit", { url });
  return response.data;
};

export const getAudits = async () => {
  const response = await api.get("/audits");
  return response.data;
};

export const getAuditDetails = async (id) => {
  const response = await api.get(`/audits/${id}`);
  return response.data;
};

export const deleteAudit = async (id) => {
  const response = await api.delete(`/audits/${id}`);
  return response.data;
};

export default api;
