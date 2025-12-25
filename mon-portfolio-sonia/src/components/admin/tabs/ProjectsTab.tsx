import { useEffect, useState, useRef } from "react";
import { ProjectCard } from "../../molecules";
import FormRow from "../../molecules/ContactForm/FormRow";
import { Button } from "../../atoms";
import { skillColors } from "../../../constants/skill";

const API_BASE = "http://localhost:5000";

export interface TProject {
  _id: string;
  name: string;
  description: string;
  sourceCodeLink?: string;
  image?: string;
  skills?: { _id: string; name: string }[];
}

export interface TSkill {
  _id: string;
  name: string;
}

type InputOrTextareaChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export default function ProjectsTab() {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [skills, setSkills] = useState<TSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", description: "", sourceCodeLink: "", image: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  const handleFetch = async (url: string, options: any = {}) => {
    try {
      const res = await fetch(url, { ...options, credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/admin/auth/login";
        return null;
      }
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchProjects = async () => {
    const res = await handleFetch(`${API_BASE}/api/admin/projects`);
    if (!res) return;
    const data = await res.json();
    setProjects(
      data.map((p: any) => ({
        _id: p._id,
        name: p.title,
        description: p.description,
        sourceCodeLink: p.link,
        image: p.image ? `${p.image.startsWith("http") ? p.image : API_BASE + p.image}` : undefined,
        skills: p.skills,
      }))
    );
  };

  const fetchSkills = async () => {
    const res = await handleFetch(`${API_BASE}/api/admin/skills`);
    if (!res) return;
    const data = await res.json();
    setSkills(data);
  };

  const handleChange = (e: InputOrTextareaChange) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE}/api/admin/projects/${editingId}` : `${API_BASE}/api/admin/projects`;

    const formData = new FormData();
    formData.append("title", form.name);
    formData.append("description", form.description);
    formData.append("link", form.sourceCodeLink);
    formData.append("skills", JSON.stringify(selectedSkills));
    if (file) formData.append("image", file);

    const res = await handleFetch(url, { method, body: formData });
    if (!res) return;
    await fetchProjects();

    // Reset form
    setForm({ name: "", description: "", sourceCodeLink: "", image: "" });
    setFile(null);
    setPreview(null);
    setSelectedSkills([]);
    setEditingId(null);
  };

  const handleEdit = (proj: TProject) => {
    setForm({ 
      name: proj.name, 
      description: proj.description, 
      sourceCodeLink: proj.sourceCodeLink || "", 
      image: proj.image || ""
    });
    setSelectedSkills(proj.skills?.map((s) => s._id) || []);
    setFile(null);
    setPreview(null);
    setEditingId(proj._id);

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id: string) => {
    const res = await handleFetch(`${API_BASE}/api/admin/projects/${id}`, { method: "DELETE" });
    if (!res) return;
    await fetchProjects();
  };

  const getImageSrc = () => {
    if (preview) return preview;
    if (form.image) return form.image.startsWith("http") ? form.image : API_BASE + form.image;
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <div ref={formRef} className="p-6 border rounded-lg bg-[rgba(0,0,0,0.35)] flex flex-col gap-4 shadow-md">
        <h2 className="text-white text-xl font-semibold">{editingId ? "Modifier Projet" : "Ajouter Projet"}</h2>
        <FormRow label="Nom" name="name" value={form.name} onChange={handleChange} />
        <FormRow label="Description" name="description" value={form.description} onChange={handleChange} isTextarea />
        <FormRow label="Lien GitHub" name="sourceCodeLink" value={form.sourceCodeLink} onChange={handleChange} />

        <div className="flex flex-col">
          <label htmlFor="project-image" className="mb-2 font-medium text-white">Image du projet</label>
          <input
            id="project-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            title="Choisir une image pour le projet"
            className="bg-[rgba(0,0,0,0.5)] border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
          />
          {getImageSrc() && (
            <img
              src={getImageSrc()!}
              alt="Preview du projet"
              className="w-40 h-40 object-cover rounded mt-2 border border-gray-400"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          {skills.map((skill) => (
            <label key={skill._id} className="flex items-center gap-2 text-white bg-[rgba(145,94,255,0.2)] px-2 py-1 rounded cursor-pointer hover:bg-[rgba(145,94,255,0.4)]">
              <input
                type="checkbox"
                className="accent-[#915EFF]"
                checked={selectedSkills.includes(skill._id)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedSkills((prev) => [...prev, skill._id]);
                  else setSelectedSkills((prev) => prev.filter((id) => id !== skill._id));
                }}
              />
              {skill.name}
            </label>
          ))}
        </div>

        <Button 
          onClick={handleSubmit} 
          className="mt-4 self-start bg-[#915EFF] hover:bg-[#7a4ed9] transition text-white font-semibold" 
          label={editingId ? "Modifier Projet" : "Ajouter Projet"} 
        />
      </div>

      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj, index) => {
          const tags = (proj.skills || []).map((skill) => ({
            name: skill.name,
            color: skillColors[skill.name] ?? "text-white/80",
          }));

          return (
            <ProjectCard
              key={proj._id}
              index={index}
              name={proj.name}
              description={proj.description}
              image={proj.image}
              sourceCodeLink={proj.sourceCodeLink}
              tags={tags}
              onEdit={() => handleEdit(proj)}
              onDelete={() => handleDelete(proj._id)}
            />
          );
        })}
      </div>
    </div>
  );
}
