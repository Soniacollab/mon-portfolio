import { useState } from "react";
import { contactAPI } from "../api/admin";

type Message = { type: "success" | "error"; text: string } | null;
type FormConfig = Record<string, { span?: string; placeholder?: string }>;

export function buildInitialState(config: FormConfig) {
  return Object.fromEntries(Object.keys(config).map((k) => [k, ""])) as Record<string, string>;
}

export default function useContactForm(formConfig: FormConfig) {
  const [form, setForm] = useState<Record<string, string>>(() => buildInitialState(formConfig));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setLoading(true);
    try {
      // Envoie tout l'objet `form` au backend. Le backend doit accepter ces clés.
      await contactAPI.send(form as any);
      setLoading(false);
      setMessage({ type: "success", text: "Merci — je vous répondrai dès que possible." });
      setForm(buildInitialState(formConfig));
      window.setTimeout(() => setMessage(null), 6000);
    } catch (err: any) {
      setLoading(false);
      // log utile pour debug
      // eslint-disable-next-line no-console
      console.error("Contact submit error:", err?.response?.data ?? err);
      setMessage({ type: "error", text: "Une erreur est survenue. Merci de réessayer plus tard." });
      window.setTimeout(() => setMessage(null), 6000);
    }
  };

  const clearMessage = () => setMessage(null);

  return {
    form,
    setForm,
    loading,
    message,
    handleChange,
    handleSubmit,
    clearMessage,
  } as const;
}
