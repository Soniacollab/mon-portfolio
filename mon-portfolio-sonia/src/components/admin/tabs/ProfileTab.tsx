import { useEffect, useRef, useState } from "react";
import FormCard from "../../molecules/ContactForm/FormCard";
import { profileAPI } from "../../../api/admin";
import { useProfile } from "../../../hooks/useProfile";
import { Toast } from "../../atoms";
import { API_BASE } from "../../../constants/api";
import { useFormManager } from "../../../hooks/useFormManager";
import { TProfileForm } from "../../../types/form";

export default function ProfileTab() {

  // Utilisation d'un ref pour le timeout du toast
  const toastTimeoutRef = useRef<number | null>(null);

  // Récupération du profil via le hook useProfile
  const { profile: sharedProfile, refetchProfile } = useProfile();

  // On adapte pour transformer l'objet formdata au format API attendu
  type FormApi = {
    create: (data: FormData) => Promise<unknown>;
    update: (id: string, data: FormData) => Promise<unknown>;
    delete: (id: string) => Promise<unknown>;
  };

  const profileAdapter: FormApi = {
    create: async (data: FormData) => profileAPI.update(data),
    update: async (_id: string, data: FormData) => profileAPI.update(data),
    delete: async (_id: string) => Promise.reject(new Error("Not supported")),
  };

  // Form par défaut
  const defaultForm: TProfileForm = {
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    avatar: undefined,
    cv: undefined,
  };

  // Hook useFormManager pour gérer le formulaire
  const {
    form,
    setForm,
    handleChange,
    handleSubmit: fmSubmit,
    errors,
  } = useFormManager<TProfileForm>({
    // On passe le form
    defaultForm,
    // On utilise l'adaptateur pour le profileAPI
    api: profileAdapter,
    // On refetch le profil après mise à jour
    fetchList: refetchProfile,
  });

  // On remplit le form avec les données du profil partagé
  useEffect(() => {
    if (!sharedProfile) return;
    setForm({
      first_name: sharedProfile.first_name || "",
      last_name: sharedProfile.last_name || "",
      email: sharedProfile.email || "",
      bio: sharedProfile.bio || "",
    });
    // Intentionally omit `setForm` from deps because its identity is not stable
    // and would cause this effect to re-run endlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedProfile]);

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);



  // Gestion de la soumission du formulaire
  const handleSubmit = async () => {
    const apiErrors = await fmSubmit();
    if (!apiErrors) {
      setToastMessage({ type: "success", text: "Profil mis à jour !" });

      // On supprime le toast après 3 secondes (on garde l'id pour cleanup)
      toastTimeoutRef.current = window.setTimeout(
        () => setToastMessage(null),
        3000
      );
    } else {
      setToastMessage({ type: "error", text: "Erreur lors de la mise à jour" });
    }
  };

  // Local wrapper for change to validate files (avatar/cv) before delegating
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;

    // If file input, run simple client-side validation
    if (target.type === "file" && target.files && target.files[0]) {
      const file = target.files[0];
      const isImageField = target.name === "avatar";
      if (isImageField) {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        if (!allowed.includes(file.type)) {
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          setToastMessage({ type: "error", text: "Format d'image non supporté (jpg/png/webp/svg)" });
          // clear toast after a while
          toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
          return;
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          setToastMessage({ type: "error", text: "Image trop volumineuse (max 2MB)" });
          toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
          return;
        }
      }
      // CV validation
      if (target.name === "cv") {
        if (file.type !== "application/pdf") {
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          setToastMessage({ type: "error", text: "Le CV doit être au format PDF" });
          toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
          return;
        }
        const maxCv = 5 * 1024 * 1024; // 5MB
        if (file.size > maxCv) {
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          setToastMessage({ type: "error", text: "CV trop volumineux (max 5MB)" });
          toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
          return;
        }
      }
    }

    // Delegate to form manager
    handleChange(e);
  };

  // Cleanup du timeout si le composant est démonté avant la fin
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);


  if (!form) return null;

  const avatarSrc = sharedProfile?.avatar
    ? sharedProfile.avatar.startsWith("http")
      ? sharedProfile.avatar
      : `${API_BASE}${sharedProfile.avatar}`
    : null;

  const isFile = (v: unknown): v is File => typeof v === "object" && v instanceof File;

  return (
    <div className="flex flex-col gap-4">

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-40">
          <div className="text-sm text-white mb-2">Photo de profil</div>
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-sm text-gray-400">
              Aucune photo
            </div>
          )}
        </div>

        <div className="flex-1">
          <FormCard
            title="Mon Profil"
            fields={[
              {
                label: "Prénom",
                name: "first_name",
                value: form.first_name,
                error: errors.first_name,
              },
              {
                label: "Nom",
                name: "last_name",
                value: form.last_name,
                error: errors.last_name,
              },
              {
                label: "Email",
                name: "email",
                value: form.email,
                error: errors.email,
              },
              {
                label: "Bio",
                name: "bio",
                value: form.bio || "",
                isTextarea: true,
                error: errors.bio,
              },
            ]}
            onChange={handleLocalChange}
            onSubmit={handleSubmit}
            submitLabel="Sauvegarder"
            fileFields={[
              {
                name: "avatar",
                label: "Avatar",
                preview: isFile(form.avatar) ? undefined : (sharedProfile?.avatar ?? null),
                accept: "image/png,image/jpeg,image/webp,image/svg+xml",
                value: form.avatar,
                showRemove: true,
              },
              {
                name: "cv",
                label: "Uploader CV (PDF)",
                preview: null,
                accept: "application/pdf",
                value: form.cv,
                showRemove: false,
                showPreview: false,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
