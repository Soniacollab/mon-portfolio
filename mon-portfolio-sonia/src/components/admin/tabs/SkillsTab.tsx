import { useState } from "react";
import ExperienceCard from "../../molecules/ExperienceCard/ExperienceCard";
import FormCard from "../../molecules/ContactForm/FormCard";
import { useFormManager } from "../../../hooks/useFormManager";
import { experienceAPI } from "../../../api/admin";
import { TExperience } from "../../../types";

const API_URL = "http://localhost:5000";

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    form,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    editingId,
    errors,
    setForm,
    formRef,
  } = useFormManager({
    defaultForm: {
      title: "",
      companyName: "",
      description: "",
      type: "job",
      startDate: "",
      endDate: "",
      points: [] as string[],
      icon: null as File | string | null,
    },
    api: experienceAPI,
    fetchList: async () => {
      const data = await experienceAPI.getAll();
      setExperiences(data);
    },
  });

  // Aperçu d’icône
  const iconPreview =
    form.icon instanceof File
      ? URL.createObjectURL(form.icon)
      : typeof form.icon === "string"
      ? `${API_URL}${form.icon}`
      : undefined;

  // Soumission du formulaire
  const onSubmit = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const apiErrors = await handleSubmit();
    if (!apiErrors) {
      setSuccessMessage(editingId ? "Expérience modifiée !" : "Expérience ajoutée !");
      setForm({
        title: "",
        companyName: "",
        description: "",
        type: "job",
        startDate: "",
        endDate: "",
        points: [],
        icon: null,
      });
    } else {
      setErrorMessage("Veuillez corriger les erreurs ci-dessous.");
    }
  };

  // Éditer une expérience
  const onEdit = (exp: TExperience) => {
    const formReady = {
      title: exp.title || "",
      companyName: exp.company || "",
      description: exp.description || "",
      type: exp.type || "job",
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      points: exp.achievements || [],
      icon: exp.icon || null,
    };
    setForm(formReady);
    handleEdit({ ...formReady, _id: exp._id });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // Supprimer une expérience
  const onDelete = async (id: string) => {
    if (!confirm("Supprimer cette expérience ?")) return;
    try {
      await handleDelete(id);
      setSuccessMessage("Expérience supprimée !");
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de la suppression");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <FormCard
        title={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
        fields={[
          { label: "Titre", name: "title", value: form.title, error: errors.title },
          { label: "Entreprise", name: "companyName", value: form.companyName, error: errors.companyName },
          { label: "Description", name: "description", value: form.description, isTextarea: true, error: errors.description },
          { label: "Type", name: "type", value: form.type, error: errors.type },
          { label: "Date de début", name: "startDate", value: form.startDate, type: "date", error: errors.startDate },
          { label: "Date de fin", name: "endDate", value: form.endDate, type: "date", error: errors.endDate },
          { label: "Réalisations (séparées par ,)", name: "points", value: form.points.join(","), isTextarea: true, error: errors.points },
        ]}
        fileField={{ name: "icon", label: "Icône", preview: iconPreview }}
        onChange={handleChange}
        onSubmit={onSubmit}
        submitLabel={editingId ? "Modifier" : "Ajouter"}
      />

      {successMessage && <p className="text-green-400 text-sm font-medium">{successMessage}</p>}
      {errorMessage && <p className="text-red-400 text-sm font-medium">{errorMessage}</p>}

      <div className="flex flex-col gap-4">
        {experiences.map(exp => (
          <ExperienceCard
            key={exp._id}
            title={exp.title}
            companyName={exp.company}
            startDate={exp.startDate}
            endDate={exp.endDate}
            points={exp.achievements || []}
            iconUrl={exp.icon ? `${API_URL}${exp.icon}` : undefined}
            iconBg="#333"
            onEdit={() => onEdit(exp)}
            onDelete={() => onDelete(exp._id)}
          />
        ))}
      </div>
    </div>
  );
}
