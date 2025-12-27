import React, { useEffect, useReducer, useRef } from "react";
import FormCard from "../../molecules/ContactForm/FormCard";
import { TProfile } from "../../../types";
import { profileAPI } from "../../../api/admin";
import { useProfile } from "../../../hooks/useProfile";

const API_URL = "http://localhost:5000";

type State = {
  profile: TProfile & { avatarFile?: File; cvFile?: File } | null;
  message: { type: "success" | "error"; text: string } | null;
  loading: boolean;
};

type Action =
  | { type: "SET_PROFILE"; payload: TProfile }
  | { type: "UPDATE_FIELD"; payload: { name: string; value: any } }
  | { type: "SET_AVATAR"; payload: File }
  | { type: "SET_CV"; payload: File }
  | { type: "SET_MESSAGE"; payload: { type: "success" | "error"; text: string } | null }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: State = {
  profile: null,
  message: null,
  loading: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "UPDATE_FIELD":
      if (!state.profile) return state;
      return { ...state, profile: { ...state.profile, [action.payload.name]: action.payload.value } };
    case "SET_AVATAR":
      if (!state.profile) return state;
      return { ...state, profile: { ...state.profile, avatarFile: action.payload } };
    case "SET_CV":
      if (!state.profile) return state;
      return { ...state, profile: { ...state.profile, cvFile: action.payload } };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export default function ProfileTab() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const formRef = useRef<HTMLDivElement>(null);

  // use shared profile hook as source of truth (avoids duplicate fetches)
  const { profile: sharedProfile, cvDownloadUrl, downloadCV, refetchProfile } = useProfile();

  useEffect(() => {
    if (sharedProfile) dispatch({ type: "SET_PROFILE", payload: sharedProfile });
  }, [sharedProfile]);

  // Handle change pour input / textarea / select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement; // files seulement pour input[type=file]

    if (type === "file" && files?.[0]) {
      if (name === "avatar") dispatch({ type: "SET_AVATAR", payload: files[0] });
      else if (name === "cv") dispatch({ type: "SET_CV", payload: files[0] });
    } else {
      dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
    }
  };

  const handleSubmit = async () => {
    if (!state.profile) return;

    const formData = new FormData();
    formData.append("first_name", state.profile.first_name);
    formData.append("last_name", state.profile.last_name);
    formData.append("email", state.profile.email);
    formData.append("bio", state.profile.bio || "");
    if (state.profile.avatarFile) formData.append("avatar", state.profile.avatarFile);
    if (state.profile.cvFile) formData.append("cv", state.profile.cvFile);

    try {
      await profileAPI.update(formData as any);
      dispatch({ type: "SET_MESSAGE", payload: { type: "success", text: "Profil mis à jour !" } });
      await refetchProfile();
    } catch (err: any) {
      dispatch({ type: "SET_MESSAGE", payload: { type: "error", text: err.message || "Une erreur est survenue." } });
    }
  };

  // Supprime le message après 4s
  useEffect(() => {
    if (!state.message) return;
    const timer = setTimeout(() => dispatch({ type: "SET_MESSAGE", payload: null }), 4000);
    return () => clearTimeout(timer);
  }, [state.message]);

  if (!state.profile) return null;

  // Preview avatar
  const avatarPreview = state.profile.avatarFile
    ? URL.createObjectURL(state.profile.avatarFile)
    : state.profile.avatar
    ? `${API_URL}${state.profile.avatar}`
    : null;

  // Preview CV (optionnel)
  const cvPreview = state.profile.cvFile
    ? state.profile.cvFile.name
    : state.profile.cv_url
    ? `${API_URL}/api/profile/cv/${state.profile.cv_url.split("/").pop()}`
    : null;

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = cvPreview || cvDownloadUrl;
    if (!url) return;
    try {
      await downloadCV(`${state.profile?.first_name || "profile"}_${state.profile?.last_name || "cv"}_CV.pdf`);
    } catch (err) {
      window.open(url, "_blank");
    }
  };

  return (
    <div ref={formRef} className="flex flex-col gap-4">
      {state.message && (
        <div className={`p-2 rounded text-center font-medium ${
          state.message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {state.message.text}
        </div>
      )}

      <FormCard
        title="Mon Profil"
        fields={[
          { label: "Prénom", name: "first_name", value: state.profile.first_name },
          { label: "Nom", name: "last_name", value: state.profile.last_name },
          { label: "Email", name: "email", value: state.profile.email },
          { label: "Bio", name: "bio", value: state.profile.bio || "", isTextarea: true },
        ]}
        fileField={{ name: "avatar", label: "Avatar", preview: avatarPreview }}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Sauvegarder"
      />

      {/* CV upload + download (admin only) */}
      <div className="flex flex-col">
        <label htmlFor={`cv-file`} className="mb-2 font-medium text-white">CV</label>
        <input
          id={`cv-file`}
          type="file"
          name="cv"
          onChange={handleChange}
          title={`Upload CV`}
          aria-label={`Upload CV`}
          className="bg-[rgba(0,0,0,0.5)] border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
        />
        {cvPreview && (
          <a
            href={cvPreview}
            onClick={handleDownload}
            download
            className="mt-2 text-sm text-sky-400 underline"
          >
            Télécharger le CV
          </a>
        )}
      </div>
    </div>
  );
}
