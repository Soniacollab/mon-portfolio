import React from "react";
import { Route, Outlet } from "react-router-dom";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminRoute from "../components/admin/AdminRoute";

type Props = {
  onLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AdminRoutes(props: Props): JSX.Element {
  const { onLogin } = props;
  return (
    <Route path="/admin" element={<Outlet />}>
      <Route
        index
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
       <Route path="secure-login" element={<AdminLogin onLogin={onLogin} />} />
    </Route>
  );
}
