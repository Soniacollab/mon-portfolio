import { useState } from "react";
import { FormCard, TechCard } from "../../molecules";
import { useFormManager } from "../../../hooks/useFormManager";
import { skillAPI } from "../../../api/admin";
import { TSkill } from "../../../types";
import { TSkillForm } from "../../../types/form";
import { Button, Toast } from "../../atoms";
import { API_BASE } from "../../../constants/api";
import { useSkills } from "../../../hooks/useSkills";

// Composant SkillsTab pour gérer les compétences
export default function SkillsTab() {
  const { skills, fetchSkills } = useSkills();
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form par défaut
  const defaultForm: TSkillForm = {
    name: "",
    technique: true,
    icon: undefined,
  };


  // Hook useFormManager pour gérer le formulaire
  const {
    form,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    editingId,
    errors,
    formRef,
  } = useFormManager<TSkillForm>({
    defaultForm,
    api: skillAPI,
    fetchList: fetchSkills,
  });

  // ------------------- Image prévisualisation ----------------
  const previewSrc =
    form.icon instanceof File
      ? URL.createObjectURL(form.icon)
      : typeof form.icon === "string" && form.icon
        ? `${API_BASE}${form.icon}`
        : undefined;


  // ------------------- Fonctions pour submit -------------------
  const onSubmit = async () => {
    // Si pas d'erreurs, on affiche un toast de succès
    const apiErrors = await handleSubmit();
    if (!apiErrors) {
      setToastMessage({
        type: "success",
        text: editingId ? "Compétence modifiée !" : "Compétence ajoutée !",
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // ------------------- Fonctions pour éditer -------------------
  const onEditSkill = (s: TSkill) => {
    const formReady: TSkillForm & { _id: string } = {
      _id: s._id,
      name: s.name || "",
      technique: typeof s.technique === "boolean" ? s.technique : true,
      icon: s.icon || undefined,
    };
    handleEdit(formReady);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  // ------------------- Fonctions pour supprimer -------------------
  const onDeleteSkill = async (id: string) => {
    if (!confirm("Supprimer cette compétence ?")) return;
    try {
      await handleDelete(id);
      setToastMessage({ type: "success", text: "Compétence supprimée !" });
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };


  // ------------------- Affichage -------------------
  return (
    <div className="flex flex-col gap-6">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <div ref={formRef}>
        <FormCard
          title={editingId ? "Modifier Compétence" : "Ajouter Compétence"}
          fields={[
            {
              label: "Nom",
              name: "name",
              value: form.name,
              error: errors.name,
            },
          ]}
          fileField={{ name: "icon", label: "Icône", preview: previewSrc, accept: "image/png,image/jpeg,image/svg+xml" }}
          onChange={handleChange}
          onSubmit={onSubmit}
          submitLabel={editingId ? "Modifier Compétence" : "Ajouter Compétence"}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={!!form.technique}
            onChange={(e) => {
              const target = { name: "technique", value: e.target.checked } as unknown as HTMLInputElement;
              handleChange({ target } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>);
            }
            }
            className="accent-[#915EFF]"
          />
          Technique
        </label>
        <Button
          onClick={onSubmit}
          label={editingId ? "Modifier" : "Ajouter"}
          className="bg-[#915EFF]"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {skills.map((s) => (
          <TechCard
            key={s._id}
            icon={s.icon ? `${API_BASE}${s.icon}` : undefined}
            name={s.name}
            isMain={true}
            onEdit={() => onEditSkill(s)}
            onDelete={() => onDeleteSkill(s._id)}
          />
        ))}
      </div>
    </div>
  );
}
