import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const initialTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", initialTheme);

console.log('DEBUG: main.jsx is running');
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);