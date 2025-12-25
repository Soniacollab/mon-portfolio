import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import PublicPage from "./pages/PublicPage";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin onLogin={setToken} />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Portfolio public */}
        <Route path="/*" element={<PublicPage />} />
      </Routes>
    </BrowserRouter>
  );
}
