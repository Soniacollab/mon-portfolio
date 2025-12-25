import { useEffect, useState, useRef } from "react";
import FormRow from "../../molecules/ContactForm/FormRow";
import { Button } from "../../atoms";
import { TProfile, getProfile } from "../../../api/profile";

export default function ProfileTab() {
  const [profile, setProfile] = useState<TProfile & { avatarFile?: File } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Récupère le profil au chargement
  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile(data);
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setProfile({ ...profile, avatarFile: file });
  };

  const handleSubmit = async () => {
    if (!profile) return;

    const formData = new FormData();
    formData.append("first_name", profile.first_name);
    formData.append("last_name", profile.last_name);
    formData.append("email", profile.email);
    formData.append("bio", profile.bio || "");
    if (profile.avatarFile) formData.append("avatar", profile.avatarFile);

    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        body: formData,
        credentials: "include", // envoie les cookies HttpOnly
      });

      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      setMessage({ type: "success", text: "Profil mis à jour !" });
      fetchProfile();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Une erreur est survenue." });
    }

    // Supprimer le message après 4 secondes
    setTimeout(() => setMessage(null), 4000);
  };

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-[rgba(0,0,0,0.3)]" ref={formRef}>
      {/* Message */}
      {message && (
        <div
          className={`p-2 rounded text-center font-medium ${
            message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar preview + upload */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20">
          {profile.avatarFile ? (
            <img
              src={URL.createObjectURL(profile.avatarFile)}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : profile.avatar ? (
            <img
              src={`http://localhost:5000${profile.avatar}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              Photo
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Form fields */}
      <FormRow label="Prénom" name="first_name" value={profile.first_name} onChange={handleChange} />
      <FormRow label="Nom" name="last_name" value={profile.last_name} onChange={handleChange} />
      <FormRow label="Email" name="email" value={profile.email} onChange={handleChange} />
      <FormRow label="Bio" name="bio" value={profile.bio || ""} onChange={handleChange} isTextarea />

      <Button onClick={handleSubmit} label="Sauvegarder" className="mt-2" />
    </div>
  );
}
