import { useState, useEffect, ChangeEvent } from "react";
import { ExperienceCard } from "../../molecules";
import FormRow from "../../molecules/ContactForm/FormRow";
import { Button } from "../../atoms";
import { TExperience } from "../../../api/experiences";

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    type: "job",
    startDate: "",
    endDate: "",
    points: [] as string[],
    icon: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/experiences", {
        credentials: "include", // HTTPOnly cookie
      });
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      console.error("fetchExperiences error:", err);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePointsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, points: e.target.value.split(",") });
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewIcon(URL.createObjectURL(file));
      setForm({ ...form, icon: file.name });
    }
  };

  const handleSubmit = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/api/admin/experiences/${editingId}`
        : "http://localhost:5000/api/admin/experiences";

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("company", form.companyName);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      form.points.forEach((p) => formData.append("achievements[]", p));

      const iconInput = document.getElementById("iconInput") as HTMLInputElement;
      if (iconInput?.files?.[0]) {
        formData.append("icon", iconInput.files[0]);
      }

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());

      setForm({
        title: "",
        companyName: "",
        description: "",
        type: "job",
        startDate: "",
        endDate: "",
        points: [],
        icon: "",
      });
      setPreviewIcon(null);
      setEditingId(null);
      fetchExperiences();
    } catch (err) {
      console.error("handleSubmit error:", err);
    }
  };

  const handleEdit = (exp: TExperience) => {
    setForm({
      title: exp.title,
      companyName: exp.company,
      description: exp.description || "",
      type: exp.type || "job",
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      points: exp.achievements || [],
      icon: exp.icon || "",
    });
    setPreviewIcon(exp.icon || null);
    setEditingId(exp._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/admin/experiences/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchExperiences();
    } catch (err) {
      console.error("handleDelete error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Formulaire admin */}
      <div className="p-4 border rounded bg-[rgba(0,0,0,0.3)] flex flex-col gap-2">
        <FormRow
         
          label="Titre"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <FormRow
      
          label="Entreprise"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
        />

        <FormRow
         
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label htmlFor="typeSelect" className="text-white mt-2">
          Type:
        </label>
        <select
          id="typeSelect"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 rounded border"
        >
          <option value="job">Job</option>
          <option value="stage">Stage</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </select>

        <label htmlFor="startDateInput" className="text-white mt-2">
          Date de début:
        </label>
        <input
          id="startDateInput"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="p-2 rounded border"
        />

        <label htmlFor="endDateInput" className="text-white mt-2">
          Date de fin:
        </label>
        <input
          id="endDateInput"
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="p-2 rounded border"
        />

        <FormRow
         
          label="Réalisations (séparées par ,)"
          name="points"
          value={form.points.join(",")}
          onChange={handlePointsChange}
        />

        <label htmlFor="iconInput" className="text-white mt-2">
          Icône:
        </label>
        <input
          id="iconInput"
          type="file"
          accept="image/*"
          onChange={handleIconChange}
          className="border p-2 rounded"
        />
        {previewIcon && (
          <img
            src={previewIcon}
            alt="Aperçu icône"
            className="mt-2 w-16 h-16 object-cover rounded"
          />
        )}

        <Button
          onClick={handleSubmit}
          className="mt-2"
          label={editingId ? "Modifier Expérience" : "Ajouter Expérience"}
        />
      </div>

      {/* Liste des expériences */}
      <div className="flex flex-col gap-4">
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp._id}
            title={exp.title}
            companyName={exp.company}
            date={exp.startDate}
            points={exp.achievements || []}
            iconUrl={exp.icon || ""}
            iconBg="#333"
            onEdit={() => handleEdit(exp)}
            onDelete={() => handleDelete(exp._id)}
          />
        ))}
      </div>
    </div>
  );
}
