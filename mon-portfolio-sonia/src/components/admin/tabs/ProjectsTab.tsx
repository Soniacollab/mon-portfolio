import React, { useEffect, useState } from "react";
import { ProjectCard } from "../../molecules";
import FormCard from "../../molecules/ContactForm/FormCard";
import { skillColors } from "../../../constants/skill";
import { projectAPI, skillAPI } from "../../../api/admin";
import { TProject, TSkill } from "../../../types";
import { TProjectForm } from "../../../types/form";
import { useFormManager } from "../../../hooks/useFormManager";

const API_BASE = "http://localhost:5000";

export default function ProjectsTab() {
  // ------------------- States -------------------
  const [projects, setProjects] = useState<TProject[]>([]);
  const [skills, setSkills] = useState<TSkill[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ------------------- Fetch data -------------------
  const fetchProjects = async () => {
    try {
      const data = await projectAPI.getAll();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des projets");
    }
  };

  const fetchSkills = async () => {
    try {
      const data = await skillAPI.getAll();
      setSkills(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des compétences");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  // ------------------- Hook Form -------------------
  const defaultProjectForm: TProjectForm = {
    title: "",
    description: "",
    link: "",
    skills: [],
    image: undefined,
  };

  const {
    form,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    errors,
    editingId,
  } = useFormManager<TProjectForm>({
    defaultForm: defaultProjectForm,
    api: projectAPI,
    fetchList: fetchProjects,
  });

  // ------------------- Fonction pour éditer un projet -------------------
  // Fonction pour éditer un projet
const handleEditProject = (proj: TProject) => {
  // Crée une version du projet adaptée au formulaire
  const formReady: TProjectForm = {
    title: proj.title,
    description: proj.description || "",
    link: proj.link,
    skills: (proj.skills || []).map((s) => (typeof s === "string" ? s : s._id)),
    image: proj.image || undefined,
  };

  // Utilise l'ID original pour le hook
  handleEdit({ ...formReady, _id: proj._id });
};


  // ------------------- Image preview -------------------
  const previewSrc =
    form.image instanceof File
      ? URL.createObjectURL(form.image)
      : typeof form.image === "string"
      ? form.image
      : null;

  // ------------------- Render -------------------
  return (
    <div className="flex flex-col gap-6">
      {/* Formulaire */}
      <FormCard
        title={editingId ? "Modifier Projet" : "Ajouter Projet"}
        fields={[
          { label: "Nom", name: "title", value: form.title, error: errors.title },
          {
            label: "Description",
            name: "description",
            value: form.description || "",
            isTextarea: true,
            error: errors.description,
          },
          { label: "Lien GitHub", name: "link", value: form.link, error: errors.link },
        ]}
        fileField={{ name: "image", label: "Image du projet", preview: previewSrc || undefined }}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Modifier Projet" : "Ajouter Projet"}
      />

      {/* Liste des compétences */}
      <div className="flex flex-wrap gap-3 mt-2">
        {skills.map((skill) => (
          <label
            key={skill._id}
            className="flex items-center gap-2 text-white bg-[rgba(145,94,255,0.2)] px-2 py-1 rounded cursor-pointer hover:bg-[rgba(145,94,255,0.4)]"
          >
            <input
              type="checkbox"
              className="accent-[#915EFF]"
              checked={form.skills.includes(skill._id)}
              onChange={() => {
                const newSkills = form.skills.includes(skill._id)
                  ? form.skills.filter((s) => s !== skill._id)
                  : [...form.skills, skill._id];
                handleChange({
                  target: { name: "skills", value: newSkills } as any,
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            {skill.name}
          </label>
        ))}
      </div>

      {/* Message d’erreur global */}
      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

      {/* Liste des projets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj, index) => {
          const tags = (proj.skills || []).map((skill) => {
            const skillObj = typeof skill === "string" ? { name: skill } : skill;
            return { name: skillObj.name, color: skillColors[skillObj.name] ?? "text-white/80" };
          });

          if (tags.length === 0) {
            tags.push({ name: "Aucune compétence pour ce projet", color: "text-white/70" });
          }

          return (
            <ProjectCard
              key={proj._id}
              index={index}
              name={proj.title}
              description={proj.description || ""}
              image={
                proj.image?.startsWith("http")
                  ? proj.image
                  : proj.image
                  ? `${API_BASE}${proj.image}`
                  : undefined
              }
              sourceCodeLink={proj.link}
              tags={tags}
              onEdit={() => handleEditProject(proj)}
              onDelete={() => handleDelete(proj._id)}
            />
          );
        })}
      </div>
    </div>
  );
}
