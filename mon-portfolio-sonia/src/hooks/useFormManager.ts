// ------------------ Hook pour gérer les formulaires avec création, édition et suppression ------------------ //

import { useReducer, useRef } from "react";
import axios from "axios";
import { refreshToken } from "../utils/auth";

// ------------------ Types ------------------ //
type FormAction<T> =
  | { type: "SET_FIELD"; field: string; value: unknown }
  | { type: "SET_FORM"; form: T }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "RESET"; defaultForm: T }
  | { type: "SET_EDITING_ID"; id: string | null };

// ------------------ Etats ------------------ //
interface FormState<T> {
  form: T;
  editingId: string | null;
  errors: Record<string, string>;
}

// ------------------ Reducer ------------------ //
function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value,
        },
      };
    case "SET_FORM":
      return {
        ...state,
        form: action.form,
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };
    case "RESET":
      return {
        form: action.defaultForm,
        editingId: null,
        errors: {},
      };
    case "SET_EDITING_ID":
      return {
        ...state,
        editingId: action.id,
      };
    default:
      return state;
  }
}

// ------------------ Fonction ------------------ //
export function useFormManager<T extends Record<string, unknown>>({
  defaultForm,
  api,
  fetchList,
}: {
  defaultForm: T;
  api: {
    create: (data: FormData) => Promise<unknown>;
    update: (id: string, data: FormData) => Promise<unknown>;
    delete: (id: string) => Promise<unknown>;
  };
  fetchList: () => Promise<unknown>;
}) {
  const [state, dispatch] = useReducer(formReducer<T>, {
    form: defaultForm,
    editingId: null,
    errors: {},
  });

  const formRef = useRef<HTMLDivElement>(null);

  // ------------------ Gestion des changements de champ ------------------ //
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const target = e.target;

  // multiple select
  if (target instanceof HTMLSelectElement && target.multiple) {
    const values = Array.from(target.selectedOptions).map((o) => o.value);
    dispatch({ type: "SET_FIELD", field: target.name, value: values });
    return;
  }

  // checkbox
  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    dispatch({ type: "SET_FIELD", field: target.name, value: target.checked });
    return;
  }

  // file
  if (target instanceof HTMLInputElement && target.type === "file" && target.files?.[0]) {
    dispatch({ type: "SET_FIELD", field: target.name, value: target.files[0] });
    return;
  }

  // textarea / text / select / etc
  dispatch({ type: "SET_FIELD", field: target.name, value: target.value });
};



  // ------------------ Soumission formulaire ------------------ //
 const handleSubmit = async (): Promise<Record<string, string> | null> => {
  dispatch({ type: "SET_ERRORS", errors: {} });

  // Création de FormData
  const data = new FormData();
  for (const key in state.form) {
    let val = state.form[key as keyof T] as unknown;

    // Gestion spéciale pour achievements : si c'est une chaîne on transforme en tableau
    if (key === "achievements" && typeof val === "string") {
      val = val
        .split(",")
        .map((a: string) => a.trim())
        .filter(Boolean);
    }

    // Si valeur est un File, on l'ajoute directement
    if (val instanceof File) {
      data.append(key, val);
    } 
    // Si valeur est un tableau, on ajoute chaque élément individuellement
    else if (Array.isArray(val)) {
      // Envoyer un tableau en JSON string pour le backend
      data.append(key, JSON.stringify(val));
    } 
    // Enfin ajout normal
    else {
      data.append(key, String(val));
    }
  }


  // Appel API create ou update
  try {
    if (state.editingId) await api.update(state.editingId, data);
    else await api.create(data);

    dispatch({ type: "RESET", defaultForm });
    await fetchList();
    return null; // pas d'erreur
  } 
  catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        try {
          const ok = await refreshToken();
          if (!ok) return null;
          if (state.editingId) await api.update(state.editingId, data);
          else await api.create(data);
          dispatch({ type: "RESET", defaultForm });
          await fetchList();
          return null;
        } catch {
          return null;
        }
      }

      const apiErrors = (err.response?.data as { errors?: Record<string, string> } | undefined)?.errors || {};
      dispatch({ type: "SET_ERRORS", errors: apiErrors });
      console.error(err);
      return apiErrors;
    }

    console.error(err);
    return null;
  }
};

  // ------------------ Supprimer ------------------ //
  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await api.delete(id);
      await fetchList();
    } catch (err: unknown) {
      // Narrow Axios errors to access response safely
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          try {
            const ok = await refreshToken();
            if (!ok) return; // caller handles UX
            await api.delete(id);
            await fetchList();
            return;
          } catch {
            return;
          }
        }
      }
      console.error(err);
    }
  };

  // ------------------ Éditer ------------------ //
  const handleEdit = (item: T & { _id: string }) => {
    const { _id, ...formWithoutId } = item;
    // Cast via unknown pour TS-safe
    dispatch({ type: "SET_FORM", form: formWithoutId as unknown as T });
    dispatch({ type: "SET_EDITING_ID", id: _id });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    form: state.form,
    setForm: (form: T) => dispatch({ type: "SET_FORM", form }),
    editingId: state.editingId,
    setEditingId: (id: string | null) => dispatch({ type: "SET_EDITING_ID", id }),
    errors: state.errors,
    setErrors: (errors: Record<string, string>) => dispatch({ type: "SET_ERRORS", errors }),
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    formRef,
  };
}
 