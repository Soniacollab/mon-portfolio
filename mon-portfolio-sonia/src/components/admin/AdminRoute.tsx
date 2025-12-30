import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import  { authAPI } from "../../api/admin";
import { refreshToken } from "../../utils/auth";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        // Vérifie si le token est valide
        await authAPI.verify();
        setOk(true);
      } catch (err: unknown) {
        // Si 401 ou token expiré, tente de rafraîchir
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
              const ok = await refreshToken();
              if (!ok) {
                setOk(false);
                return;
              }
            // Re-vérifie après refresh
            await authAPI.verify();
            setOk(true);
          } catch {
            setOk(false);
          }
        } else {
          setOk(false);
        }
      }
    };

    verify();
  }, []);

  if (ok === null) {
    return <div className="text-white p-8">Chargement…</div>;
  }

  if (!ok) {
    return <Navigate to="/admin/secure-login" replace />;
  }

  return children;
};

export default AdminRoute;
