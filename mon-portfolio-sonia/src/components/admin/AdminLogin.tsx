import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import FormRow from "../molecules/ContactForm/FormRow";
import { Button } from "../atoms";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/admin";

// Props pour AdminLogin
interface AdminLoginProps {
  // J'ulise un callback pour mettre à jour l'état de login dans le parent
  onLogin: Dispatch<SetStateAction<boolean>>;
}

// Composant AdminLogin
const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authAPI.login({ email, password }); // axios gère cookies
      if (res.status === 200) {
        // Si succès, on met à jour l'état de login dans le parent
        onLogin(true);
        navigate("/admin");
      }
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Identifiants invalides" : String(err));
    }
  };

  // ------------------- Affichage -------------------
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-6 font-bold">Admin Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <FormRow
          label="Email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <FormRow
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" label="Login" />
      </form>
    </div>
  );
};

export default AdminLogin;
