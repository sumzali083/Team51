import axios from "axios";

const API_BASE = "https://cs2team51.cs2410-web01pvm.aston.ac.uk/api";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
