import { Routes, Route } from "react-router-dom";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminRoute from "../components/admin/AdminRoute";

const AdminPage: React.FC = () => {
  const onLoginPlaceholder: React.Dispatch<React.SetStateAction<boolean>> = () => {};

  return (
    <Routes>
      <Route
        index
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route path="secure-login" element={<AdminLogin onLogin={onLoginPlaceholder} />} />
    </Routes>
  );
};

export default AdminPage;
