const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://staracademy.pythonanywhere.com/api";

export default API_BASE_URL;
