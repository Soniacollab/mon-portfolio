import React, { useState, useRef } from "react";
import { Button } from "../../atoms";
import { config } from "../../../constants/config";
import FormRow from "./FormRow";
// server-side contact endpoint will be used instead of EmailJS


const INITIAL_STATE = Object.fromEntries(
  Object.keys(config.contact.form).map((input) => [input, ""])
);

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // unused EmailJS config removed

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // POST to backend /api/contact
    fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      credentials: "include",
    })
      .then(async (res) => {
        setLoading(false);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error("Contact submit error:", data);
          setMessage({ type: "error", text: "Something went wrong. Please try again later." });
          setTimeout(() => setMessage(null), 6000);
          return;
        }
        setMessage({ type: "success", text: "Thank you. I will get back to you as soon as possible." });
        setForm(INITIAL_STATE);
        setTimeout(() => setMessage(null), 6000);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        setMessage({ type: "error", text: "Something went wrong. Please check your connection and try again." });
        setTimeout(() => setMessage(null), 6000);
      });
      
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      {message && (
        <div
          className={`w-full p-3 rounded-md flex items-center justify-between text-white ${
            message.type === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-red-500 to-rose-400"
          }`}
        >
          <div className="text-sm">{message.text}</div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-4 opacity-90 hover:opacity-100"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}
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
