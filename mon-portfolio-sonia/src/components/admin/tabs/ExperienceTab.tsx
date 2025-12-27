import { useState, useEffect } from "react";
import ExperienceCard from "../../molecules/ExperienceCard/ExperienceCard";
import FormCard from "../../molecules/ContactForm/FormCard";
import parseAchievements from "../../../utils/parseAchievements";
import { experienceAPI } from "../../../api/admin";
import { skillAPI } from "../../../api/admin";
import { TExperience } from "../../../types";
import { useFormManager } from "../../../hooks/useFormManager";
import { Button } from "../../atoms";
import { TSkill } from "../../../types";

const API_BASE = "http://localhost:5000";

type TExperienceForm = {
  title: string;
  company: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  achievements: string; // séparées par des virgules
  experienceIcon: File | string | null;
  technologies: string[]; // array of skill ids or names
};

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [availableSkills, setAvailableSkills] = useState<TSkill[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch des expériences
  const fetchExperiences = async () => {
    try {
      const data = await experienceAPI.getAll();
      setExperiences(data);
    } catch (err) {
      console.error("Erreur fetch experiences:", err);
    }
  };

  useEffect(() => {
    fetchExperiences();
    // fetch skills for multi-select
    (async () => {
      try {
        const s = await skillAPI.getAll();
        setAvailableSkills(s);
      } catch (err) {
        console.error("Erreur fetch skills:", err);
      }
    })();
  }, []);

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

  // ------------------- Soumission -------------------
  const handleSubmit = async () => {
    const apiErrors = await submitForm();
    if (!apiErrors) {
      setSuccessMessage(
        editingId ? "Expérience modifiée avec succès !" : "Expérience ajoutée avec succès !"
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // ------------------- Préparer édition -------------------
  const handleEditExperience = (exp: TExperience) => {
    const achievementsString = parseAchievements(exp.achievements).join(", "); // normalize then join for form
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
      technologies: (exp.technologies || []).map((t: any) => (t._id ? t._id : String(t))),
    };
    handleEdit(formReady);
  };

  // ------------------- Prévisualisation image -------------------
  const previewSrc =
    form.experienceIcon instanceof File
      ? URL.createObjectURL(form.experienceIcon)
      : form.experienceIcon && typeof form.experienceIcon === "string"
      ? `${API_BASE}${form.experienceIcon}`
      : null;

    // parseAchievements is imported from src/utils/parseAchievements


  return (
    <div className="flex flex-col gap-6">
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Formulaire */}
      <div ref={formRef}>
        <FormCard
          title={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
          fields={[
            { label: "Titre", name: "title", value: form.title, error: errors.title, placeholder: "Ex: Développeur Full Stack" },
            { label: "Entreprise", name: "company", value: form.company, error: errors.company, placeholder: "Ex: Google" },
            { label: "Description", name: "description", value: form.description, error: errors.description, isTextarea: true, placeholder: "Description détaillée" },
            { label: "Réalisations (séparées par ,)", name: "achievements", value: form.achievements, error: errors.achievements, placeholder: "Ex: Refonte API, Optimisation, Migration React" },
          ]}
          fileField={{ name: "experienceIcon", label: "Icône/Logo", preview: previewSrc || undefined }}
          onChange={handleChange}
          onSubmit={handleSubmit}
          hideSubmit
          submitLabel={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
        />
      </div>

      {/* Type et dates */}
      <div className="p-4 border rounded bg-[rgba(0,0,0,0.35)] flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="type" className="mb-2 font-medium text-white">Type d'expérience:</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`p-2 rounded border bg-[rgba(0,0,0,0.5)] text-white ${errors.type ? 'border-red-500' : 'border-[rgba(145,94,255,0.25)]'}`}
          >
            <option value="job">Job</option>
            <option value="stage">Stage</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="mb-2 font-medium text-white">Date de début:</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`p-2 rounded border bg-[rgba(0,0,0,0.5)] text-white ${errors.startDate ? 'border-red-500' : 'border-[rgba(145,94,255,0.25)]'}`}
            />
            {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="mb-2 font-medium text-white">Date de fin (vide si en cours):</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={`p-2 rounded border bg-[rgba(0,0,0,0.5)] text-white ${errors.endDate ? 'border-red-500' : 'border-[rgba(145,94,255,0.25)]'}`}
            />
            {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-2">
        {availableSkills.map((skill) => (
          <label
            key={skill._id}
            className="flex items-center gap-2 text-white bg-[rgba(145,94,255,0.2)] px-2 py-1 rounded cursor-pointer hover:bg-[rgba(145,94,255,0.4)]"
          >
            <input
              type="checkbox"
              className="accent-[#915EFF]"
              checked={Array.isArray(form.technologies) && form.technologies.includes(skill._id)}
              onChange={() => {
                const newTechs = Array.isArray(form.technologies) ? [...form.technologies] : [];
                const already = newTechs.includes(skill._id);
                const updated = already ? newTechs.filter((s) => s !== skill._id) : [...newTechs, skill._id];
                handleChange({ target: { name: "technologies", value: updated } } as any);
              }}
            />
            {skill.name}
          </label>
        ))}
      </div>

      {/* External submit button positioned after technologies */}
      <div className="mt-4">
        <Button onClick={handleSubmit} label={editingId ? "Modifier Expérience" : "Ajouter Expérience"} className="bg-[#915EFF]" />
      </div>

      {/* Liste des expériences */}
      <div className="flex flex-col gap-4">
        {experiences.map(exp => {
          const pointsArr = parseAchievements(exp.achievements);

          const techs = exp.technologies?.map((t: any) => t.name).filter(Boolean).join(", ");
          if (techs) pointsArr.push(`Technologies : ${techs}`);

          return (
            <ExperienceCard
              key={exp._id}
              title={exp.title}
              companyName={exp.company}
              startDate={exp.startDate?.split("T")[0] || ""}
              endDate={exp.endDate?.split("T")[0] || ""}
              points={pointsArr} // <- passe le tableau à List
              iconUrl={exp.icon ? `${API_BASE}${exp.icon}` : undefined}
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
