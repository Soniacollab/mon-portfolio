import { ProjectCard } from "../../molecules";
import FormCard from "../../molecules/ContactForm/FormCard";
import { skillColors } from "../../../constants/skill";
import { projectAPI } from "../../../api/admin";
import { TProject } from "../../../types";
import { TProjectForm } from "../../../types/form";
import { useFormManager } from "../../../hooks/useFormManager";
import { MultiSelectSkills } from "../../molecules";
import { useSkills } from "../../../hooks/useSkills";
import { useProjects } from "../../../hooks/useProjects";
import { API_BASE } from "../../../constants/api";

export default function ProjectsTab() {
  // ------------------- Les états de mon form -------------------
  const { projects, refetch, error: hookError } = useProjects();
  const { skills } = useSkills();
  const error = hookError ?? null;

  // On définit le form par défaut
  const defaultProjectForm: TProjectForm = {
    title: "",
    description: "",
    link: "",
    skills: [],
    image: undefined,
  };

  // Hook useFormManager pour gérer le formulaire
  const {
    form,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    errors,
    editingId,
    formRef,
  } = useFormManager<TProjectForm>({
    defaultForm: defaultProjectForm,
    api: projectAPI,
    fetchList: refetch,
  });


  // --------------- Fonction pour éditer un projet ------------
  const handleEditProject = (proj: TProject) => {
    // Crée une version du projet adaptée à mon form
    const formReady: TProjectForm = {
      title: proj.title,
      description: proj.description || "",
      link: proj.link,
      skills: (proj.skills || []).map((s) =>
        typeof s === "string" ? s : s._id
      ),
      image: proj.image || undefined,
    };

    // Utiliser l'ID original pour le hook
    handleEdit({ ...formReady, _id: proj._id });
  };


  // ------------------- Image prévisualisation ----------------
  const previewSrc =
    form.image instanceof File
      ? URL.createObjectURL(form.image)
      : typeof form.image === "string"
        ? form.image
        : null;

  // ------------------- Affichage -------------------
  return (
    <div className="flex flex-col gap-6">
      {/* Formulaire */}
      <FormCard
        title={editingId ? "Modifier Projet" : "Ajouter Projet"}
        fields={[
          {
            label: "Nom",
            name: "title",
            value: form.title,
            error: errors.title,
          },
          {
            label: "Description",
            name: "description",
            value: form.description || "",
            isTextarea: true,
            error: errors.description,
          },
          {
            label: "Lien GitHub",
            name: "link",
            value: form.link,
            error: errors.link,
          },
        ]}
        fileField={{
          name: "image",
          label: "Image du projet",
          preview: previewSrc || undefined,
        }}
        onChange={handleChange}
        onSubmit={handleSubmit}
        // Faire formref pour pouvoir scroller vers le form
        ref={formRef}
        submitLabel={editingId ? "Modifier Projet" : "Ajouter Projet"}
      />

      {/* Liste des compétences */}
      <div className="mt-2">
        <MultiSelectSkills
          skills={skills}
          selected={form.skills}
          onChange={(updated) => {
            const target = { name: "skills", value: updated } as unknown as HTMLInputElement;
            handleChange({ target } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>);
          }}
        />
      </div>

      {/* Message d’erreur global */}
      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

      {/* Liste des projets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj, index) => {
          const tags = (proj.skills || []).map((skill) => {
            const skillObj =
              typeof skill === "string" ? { name: skill } : skill;
            return {
              name: skillObj.name,
              color: skillColors[skillObj.name] ?? "text-white/80",
            };
          });

          if (tags.length === 0) {
            tags.push({
              name: "Aucune compétence pour ce projet",
              color: "text-white/70",
            });
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
