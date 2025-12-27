import { useRef } from "react";
import { Button, Toast } from "../../atoms";
import { config } from "../../../constants/config";
import FormRow from "./FormRow";
import useContactForm from "../../../hooks/useContactForm";

// État initial et gestion du form
const ContactForm: React.FC = () => {

  // référence DOM du formulaire 
  const formRef = useRef<HTMLFormElement>(null);

  // Ici on utilise le hook pour la logique du formulaire
  const { form, loading, message, handleChange, handleSubmit, clearMessage } =
    useContactForm(config.contact.form);

  return (

    // formulaire contrôlé
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-5"
    >
      {/* Toast affiche les messages success / error */}
      <Toast message={message} onClose={clearMessage} />

      {/* Génération des champs depuis la config */}
      {Object.keys(config.contact.form).map((input) => {
        const { span, placeholder } =
          config.contact.form[input as keyof typeof config.contact.form];
        return (
          <FormRow
            key={input}
            label={span}
            name={input}
            value={form[input as keyof typeof form]}
            placeholder={placeholder}
            onChange={handleChange}
            isTextarea={input === "message"}
            type={input === "email" ? "email" : "text"}
          />
        );
      })}

      {/* Bouton d'envoi */}
      <Button
        type="submit"
        label={loading ? "Envoi..." : "Envoyer"}
        className="bg-gradient-to-r from-[#915EFF] via-[#7dd3fc] to-[#00c8ff] text-white font-semibold py-3 px-8 rounded-xl shadow-md mt-3 self-center transition hover:scale-105"
      />
    </form>
  );
};

export default ContactForm;
