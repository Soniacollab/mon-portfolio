import React, { useState, useRef } from "react";
import { Button } from "../../atoms";
import { config } from "../../../constants/config";
import FormRow from "./FormRow";
import emailjs from "@emailjs/browser";


const INITIAL_STATE = Object.fromEntries(
  Object.keys(config.contact.form).map((input) => [input, ""])
);

const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  accessToken: import.meta.env.VITE_EMAILJS_ACCESS_TOKEN,
};

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          form_name: form.name,
          to_name: config.html.fullName,
          from_email: form.email,
          to_email: config.html.email,
          message: form.message,
        },
        emailjsConfig.accessToken
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");
          setForm(INITIAL_STATE);
        },
        (error) => {
          setLoading(false);
          console.log(error);
          alert("Something went wrong.");
        }
      );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      {Object.keys(config.contact.form).map((input) => {
        const { span, placeholder } = config.contact.form[input as keyof typeof config.contact.form];
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

      <Button
        type="submit"
        label={loading ? "Sending..." : "Send"}
        className="bg-gradient-to-r from-[#915EFF] via-[#7dd3fc] to-[#00c8ff] text-white font-semibold py-3 px-8 rounded-xl shadow-md mt-3 self-center transition hover:scale-105"
      />
    </form>
  );
};

export default ContactForm;
