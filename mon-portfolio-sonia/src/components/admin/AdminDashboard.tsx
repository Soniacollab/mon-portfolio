import { useState } from "react";
import ProjectsTab from "./tabs/ProjectsTab";
import SkillsTab from "./tabs/SkillsTab";
import ProfileTab from "./tabs/ProfileTab";
import { authAPI } from "../../api/admin"; 
import ExperienceTab from "./tabs/ExperienceTab";

const AdminDashboard = () => {
  // Gestion des onglets par défaut sur "projects"
  const [activeTab, setActiveTab] = useState("projects");

  // Fonction de logout
  const handleLogout = async () => {
    try {
      await authAPI.logout(); 
    } catch (err) {
      console.error("Erreur logout", err);
    } finally {
      window.location.href = "/admin/secure-login"; // On redirige vers la page de login
    }
  };


  // ------------------- Affichage -------------------
  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl text-white">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Onglets */}
      <div className="flex gap-4 mb-6">
        {["projects", "skills", "profile", "experiences"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-600" : "bg-gray-700"} text-white`}
          >
            
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet */}
      <div className="bg-[rgba(0,0,0,0.3)] p-4 rounded">
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "experiences" && <ExperienceTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
