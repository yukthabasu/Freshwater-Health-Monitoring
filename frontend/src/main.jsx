import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";

// Automatically attach the logged-in user's JWT token
// to every request sent through Axios.
axios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "freshwaterToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);