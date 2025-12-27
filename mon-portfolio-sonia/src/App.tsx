import { BrowserRouter, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminRoutes from "./routes/adminRoutes";
import PublicRoutes from "./routes/publicRoutes";

export default function App() {
  const [, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/admin/me", { credentials: "include" })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {AdminRoutes({ onLogin: setIsAuthenticated })}
        {PublicRoutes()}
      </Routes>
    </BrowserRouter>
  );
}