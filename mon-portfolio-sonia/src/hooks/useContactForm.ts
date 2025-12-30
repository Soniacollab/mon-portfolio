//------------- Hook pour gérer un formulaire de contact ----------//

import { useState } from "react";
import { contactAPI } from "../api/admin";

// Type pour le message de retour
type Message = { type: "success" | "error"; text: string } | null;

// Configuration du formulaire et ici chaque champ peut avoir des options
type FormConfig = Record<string, { span?: string; placeholder?: string }>;

// fonction pour construire l'état initial du formulaire
export function buildInitialState(config: FormConfig) {
  // On initialise chaque champ à une chaîne vide
  // avec map on crée un tableau de paires [clé, valeur] pour chaque champ
  return Object.fromEntries(Object.keys(config).map((k) => [k, ""])) as Record<
    string,
    string
  >;
}


// Fonction principale du hook
export default function useContactForm(formConfig: FormConfig) {

  // D'abord on initialise les états
  const [form, setForm] = useState<Record<string, string>>(() =>
    buildInitialState(formConfig)
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  // Gestion des changements de champ
  const handleChange = (

    // Événement de changement provenant d'un input, textarea ou select
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // On met à jour le champ correspondant dans le form
    const { name, value } = e.target;
    // Mise à jour de l'état du formulaire
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  // Gestion de la soumission du formulaire
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {

    // Si un événement est passé on va empêcher le comportement par défaut
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setLoading(true);
    try {
      // Envoie tout l'objet `form` au backend et le backend doit accepter ces keys
      await contactAPI.send(
        form as unknown as { name: string; email: string; message: string }
      );

      // Si tout se passe bien, on affiche un message de succès
      setLoading(false);
      setMessage({
        type: "success",
        text: "Merci — je vous répondrai dès que possible.",
      });

      // Enfin on réinitialise le formulaire après un délai de 6s
      setForm(buildInitialState(formConfig));
      window.setTimeout(() => setMessage(null), 6000);
    } catch (err: unknown) {
      setLoading(false);
      // En cas d'erreur, on affiche un message d'erreur
      setMessage({
        type: "error",
        text: "Une erreur est survenue. Merci de réessayer plus tard.",
      });
      window.setTimeout(() => setMessage(null), 6000);
    }
  };

  // Fonction pour effacer le message
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
