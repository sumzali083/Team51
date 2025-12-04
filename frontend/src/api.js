import axios from "axios";

// Use the HTTPS backend your browser can reach
const API_BASE = "https://cs2team51.cs2410-web01pvm.aston.ac.uk";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
