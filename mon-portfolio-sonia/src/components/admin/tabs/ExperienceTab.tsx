import { useState } from "react";
import { ExperienceCard, FormCard, MultiSelectSkills } from "../../molecules";
import parseAchievements from "../../../shared/parseAchievements";
import { experienceAPI } from "../../../api/admin";
import { useSkills } from "../../../hooks/useSkills";
import { useExperiences } from "../../../hooks/useExperiences";
import { TExperience } from "../../../types";
import { TExperienceForm } from "../../../types/form";
import { useFormManager } from "../../../hooks/useFormManager";
import { Button, Toast } from "../../atoms";
import { API_BASE } from "../../../constants/api";
const thp = "/assets/thp.png";

// Fonction principale du composant ExperienceTab
export default function ExperienceTab() {

  // ------------------- États -------------------
  // Liste des expériences (via mon hook)
  const { experiences, fetchExperiences } = useExperiences();
  // Récupération des compétences disponibles
  const { skills: availableSkills } = useSkills();
  // Message de toast pour les notifications
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // On définit le form par défaut pour une expérience
  const defaultExperienceForm: TExperienceForm = {
    title: "",
    company: "",
    description: "",
    type: "job",
    startDate: "",
    endDate: "",
    achievements: "",
    experienceIcon: null,
    technologies: [],
  };

  
  // Ici on utilise le hook useFormManager pour gérer le formulaire
  // C'est à dire l'état du form, les changements, la soumission, etc
  const {
    form,
    handleChange,
    handleSubmit: submitForm,
    handleEdit,
    handleDelete,
    errors,
    editingId,
    formRef,
  } = useFormManager<TExperienceForm>({
    defaultForm: defaultExperienceForm,
    api: experienceAPI,
    fetchList: fetchExperiences,
  });



  // ------------------- Pour la soumission -------------------
  const handleSubmit = async () => {
  
    // On vérifie les erreurs via le submitForm du hook
    const apiErrors = await submitForm();
    // Si pas d'erreurs, on affiche un message de succès
    if (!apiErrors) {
      setToastMessage({
        type: "success",
        text: editingId
          ? "Expérience modifiée avec succès !"
          : "Expérience ajoutée avec succès !",
      });
      // Et on efface le message après 3 secondes
      setTimeout(() => setToastMessage(null), 3000);
    }
  };


  // ------------------- Pour édition -------------------
  const handleEditExperience = (exp: TExperience) => {
    
    // D'abord on parse les réalisations en string
    const achievementsString = parseAchievements(exp.achievements).join(", "); 

    // Puis on crée un formReady adapté au formulaire
    const formReady: TExperienceForm & { _id: string } = {
      _id: exp._id,
      title: exp.title || "",
      company: exp.company || "",
      description: exp.description || "",
      type: exp.type || "job",
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      achievements: achievementsString,
      experienceIcon: exp.icon || null,
      technologies: (exp.technologies || []).map((t: unknown) =>
        typeof t === "object" && t !== null && "_id" in (t as Record<string, unknown>)
          ? String((t as Record<string, unknown>)["_id"])
          : String(t)
      ),
    };
    // On utilise handleEdit du hook pour remplir le form
    handleEdit(formReady);
  };



  // ------------------- Prévisualisation image -------------------
  // previewSrc is intentionally not used in admin form (we hide previews in the form)

  

  return (
    <div className="flex flex-col gap-6">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Formulaire */}
      <div ref={formRef}>
        <FormCard
          title={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
          fields={[
            {
              label: "Titre",
              name: "title",
              value: form.title,
              error: errors.title,
              placeholder: "Ex: Développeur Full Stack",
            },
            {
              label: "Entreprise",
              name: "company",
              value: form.company,
              error: errors.company,
              placeholder: "Ex: Google",
            },
            {
              label: "Description",
              name: "description",
              value: form.description,
              error: errors.description,
              isTextarea: true,
              placeholder: "Description détaillée",
            },
            {
              label: "Réalisations (séparées par ,)",
              name: "achievements",
              value: form.achievements,
              error: errors.achievements,
              placeholder: "Ex: Refonte API, Optimisation, Migration React",
            },
          ]}
          fileField={{
            name: "experienceIcon",
            label: "Icône/Logo",
            // Ne pas montrer la prévisualisation dans le formulaire (les icônes doivent rester dans les cards)
            preview: undefined,
            showPreview: false,
          }}
          onChange={handleChange}
          onSubmit={handleSubmit}
          hideSubmit
          submitLabel={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
        />
      </div>

      {/* Type et dates */}
      <div className="p-4 border rounded bg-[rgba(0,0,0,0.35)] flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="type" className="mb-2 font-medium text-white">
            Type d&apos;expérience:
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`p-2 rounded border bg-[rgba(0,0,0,0.5)] text-white ${
              errors.type ? "border-red-500" : "border-[rgba(145,94,255,0.25)]"
            }`}
          >
            <option value="job">Job</option>
            <option value="stage">Stage</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          {errors.type && (
            <p className="text-red-400 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="mb-2 font-medium text-white">
              Date de début:
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`p-2 rounded border bg-[rgba(0,0,0,0.5)] text-white ${
                errors.startDate
                  ? "border-red-500"
                  : "border-[rgba(145,94,255,0.25)]"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="mb-2 font-medium text-white">
              Date de fin (vide si en cours):
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={`p-2 rounded border bg-[rgba(0,0,0,0.5)] text-white ${
                errors.endDate
                  ? "border-red-500"
                  : "border-[rgba(145,94,255,0.25)]"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <MultiSelectSkills
          skills={availableSkills}
          selected={Array.isArray(form.technologies) ? form.technologies : []}
          onChange={(updated) => {
            const target = { name: "technologies", value: updated } as unknown as HTMLInputElement;
            handleChange({ target } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>);
          }}
        />
      </div>

      
      <div className="mt-4">
        <Button
          onClick={handleSubmit}
          label={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
          className="bg-[#915EFF]"
        />
      </div>

      {/* Liste des expériences */}
      <div className="flex flex-col gap-4">
        {experiences.map((exp) => {
          const pointsArr = parseAchievements(exp.achievements);

          const techs = exp.technologies
            ?.map((t: unknown) => (typeof t === "object" && t !== null ? String((t as Record<string, unknown>)["name"] ?? "") : String(t)))
            .filter(Boolean)
            .join(", ");
          if (techs) pointsArr.push(`Technologies : ${techs}`);

          return (
            <ExperienceCard
              key={exp._id}
              plain
              title={exp.title}
              companyName={exp.company}
              startDate={exp.startDate?.split("T")[0] || ""}
              endDate={exp.endDate?.split("T")[0] || ""}
              points={pointsArr} // ON passe le tableau à List
              iconUrl={exp.icon ? (exp.icon.startsWith("http") ? exp.icon : `${API_BASE}${exp.icon}`) : thp}
              iconBg="#333"
              onEdit={() => handleEditExperience(exp)}
              onDelete={() => handleDelete(exp._id)}
            />
          );
        })}
      </div>
    </div>
  );
}
