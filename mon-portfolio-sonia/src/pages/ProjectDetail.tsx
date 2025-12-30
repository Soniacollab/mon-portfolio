import { useParams } from "react-router-dom";
import { Navbar } from "../components";
import { useProjects } from "../hooks/useProjects";
import { ProjectDetailCard } from "../components/molecules/ProjectDetails";



const ProjectDetail = () => {
  // Récupération de l'ID du projet depuis les paramètres d'URL
  const { id } = useParams<{ id: string }>();
  const { projects, loading, error } = useProjects();



  if (loading) return <p className="text-white text-center">Chargement...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const project = projects.find((p) => p._id === id);
  if (!project) return <p className="text-white text-center">Projet introuvable</p>;

 
  //---------------- Rendu du détail du projet -----------------
  return (
    <div className="bg-gradient-to-br from-primary via-[#0a0a0a] to-[#1a1a2e] min-h-screen flex flex-col">
      <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <Navbar />
      </div>

      <main className="px-6 py-16 w-full flex-1 flex items-center justify-center">
        {/* Utilisation de mon composant ProjectDetailCard */}
        <ProjectDetailCard project={project} />
      </main>
    </div>
  );
};

export default ProjectDetail;
