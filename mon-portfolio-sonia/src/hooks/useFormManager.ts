import { useReducer, useRef } from "react";
import { authAPI } from "../api/admin";

// ------------------ Types ------------------ //
type FormAction<T> =
  | { type: "SET_FIELD"; field: string; value: any }
  | { type: "SET_FORM"; form: T }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "RESET"; defaultForm: T }
  | { type: "SET_EDITING_ID"; id: string | null };

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

// ------------------ Hook ------------------ //
export function useFormManager<T extends Record<string, any>>({
  defaultForm,
  api,
  fetchList,
}: {
  defaultForm: T;
  api: {
    create: (data: FormData) => Promise<any>;
    update: (id: string, data: FormData) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  fetchList: () => Promise<any>;
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

  // textarea / text / select / etc.
  dispatch({ type: "SET_FIELD", field: target.name, value: target.value });
};



  // ------------------ Soumission formulaire ------------------ //
 const handleSubmit = async (): Promise<Record<string, string> | null> => {
  dispatch({ type: "SET_ERRORS", errors: {} });

  // Création de FormData
  const data = new FormData();
  for (const key in state.form) {
    let val = state.form[key as keyof T] as unknown;

    // Gestion spéciale pour achievements : si c'est une chaîne, transformer en tableau
    if (key === "achievements" && typeof val === "string") {
      val = val
        .split(",")
        .map((a: string) => a.trim())
        .filter(Boolean);
    }

    if (val instanceof File) {
      data.append(key, val);
    } else if (Array.isArray(val)) {
      // Envoyer un tableau en JSON string pour le backend
      data.append(key, JSON.stringify(val));
    } else {
      data.append(key, String(val));
    }
  }

  try {
    if (state.editingId) await api.update(state.editingId, data);
    else await api.create(data);

    dispatch({ type: "RESET", defaultForm });
    await fetchList();
    return null; // pas d'erreur
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      try {
        await authAPI.refreshToken();
        if (state.editingId) await api.update(state.editingId, data);
        else await api.create(data);
        dispatch({ type: "RESET", defaultForm });
        await fetchList();
        return null;
      } catch {
        window.location.href = "/admin/secure-login";
        return null;
      }
    }

    const apiErrors = err?.response?.data?.errors || {};
    dispatch({ type: "SET_ERRORS", errors: apiErrors });
    console.error(err);
    return apiErrors;
  }
};

  // ------------------ Supprimer ------------------ //
  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await api.delete(id);
      await fetchList();
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        try {
          await authAPI.refreshToken();
          await api.delete(id);
          await fetchList();
          return;
        } catch {
          window.location.href = "/admin/secure-login";
          return;
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
 