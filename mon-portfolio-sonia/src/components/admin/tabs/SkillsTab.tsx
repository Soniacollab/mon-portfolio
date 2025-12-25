import { useEffect, useState, useRef } from "react";
import TechCard from "../../molecules/TechCard/TechCard";
import FormRow from "../../molecules/ContactForm/FormRow";
import { Button, Input } from "../../atoms";
import { TSkill, getSkills } from "../../../api/skills";

const SERVER_URL = "http://localhost:5000";
const DEFAULT_ICON = `${SERVER_URL}/uploads/skills/icon-1766599236793.png`;

export default function SkillsTab() {
  const [skills, setSkills] = useState<TSkill[]>([]);
  const [form, setForm] = useState({
    name: "",
    iconFile: null as File | null,
    iconPath: DEFAULT_ICON, // fallback par défaut
    technique: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchSkills = async () => {
    const data = await getSkills();
    setSkills(data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type, checked, files, value } = target;

    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === "file" && files && files[0]) {
      const file = files[0];
      setForm(prev => ({
        ...prev,
        iconFile: file,
        iconPath: URL.createObjectURL(file),
      }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name) return alert("Nom requis");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${SERVER_URL}/api/admin/skills/${editingId}`
      : `${SERVER_URL}/api/admin/skills`;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("technique", String(form.technique));
    if (form.iconFile) formData.append("icon", form.iconFile);

    const res = await fetch(url, { method, body: formData, credentials: "include" });
    if (!res.ok) return alert("Erreur serveur : " + res.status);

    setForm({ name: "", iconFile: null, iconPath: DEFAULT_ICON, technique: true });
    setEditingId(null);
    fetchSkills();
  };

  const handleEdit = (skill: TSkill) => {
    setForm({
      name: skill.name,
      iconFile: null,
      iconPath: skill.icon ? `${SERVER_URL}${skill.icon}` : DEFAULT_ICON, // fallback
      technique: skill.technique,
    });
    setEditingId(skill._id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette compétence ?")) return;
    await fetch(`${SERVER_URL}/api/admin/skills/${id}`, { method: "DELETE", credentials: "include" });
    fetchSkills();
  };

  const mainSkills = skills.filter(s => s.technique);
  const otherSkills = skills.filter(s => !s.technique);

  return (
    <div className="flex flex-col gap-8">
      {/* FORM */}
      <div ref={formRef} className="p-4 border rounded bg-[rgba(0,0,0,0.3)] flex flex-col gap-3">
        <FormRow label="Nom" name="name" value={form.name} onChange={handleChange} />
        <div className="flex flex-col">
          <label className="text-white mb-1">Icône</label>
          <Input type="file" onChange={handleChange} />
        </div>
        <div className="flex items-center gap-2">
          <Input type="checkbox" name="technique" checked={form.technique} onChange={handleChange} />
          <label className="text-white">Compétence technique</label>
        </div>
        <Button onClick={handleSubmit} label={editingId ? "Modifier" : "Ajouter"} />
      </div>

      {/* SKILLS */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
          {mainSkills.map(skill => (
            <TechCard
              key={skill._id}
              name={skill.name}
              icon={skill.icon ? `${SERVER_URL}${skill.icon}` : DEFAULT_ICON} // fallback
              isMain={true}
              onEdit={() => handleEdit(skill)}
              onDelete={() => handleDelete(skill._id)}
            />
          ))}
        </div>

        {otherSkills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {otherSkills.map(skill => (
              <TechCard
                key={skill._id}
                name={skill.name}
                icon={skill.icon ? `${SERVER_URL}${skill.icon}` : DEFAULT_ICON} // fallback
                isMain={false}
                onEdit={() => handleEdit(skill)}
                onDelete={() => handleDelete(skill._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
