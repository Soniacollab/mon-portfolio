import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

import { EarthCanvas } from "../canvas";
import { SectionWrapper } from "../../hoc";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";

const INITIAL_STATE = Object.fromEntries(
  Object.keys(config.contact.form).map((input) => [input, ""])
);

const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  accessToken: import.meta.env.VITE_EMAILJS_ACCESS_TOKEN,
};

const Contact = () => {
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
    <div className="flex flex-col items-center gap-8 w-full px-4 md:px-12 xl:px-20 py-12">
      {/* Titre + ligne de séparation */}
      <h2 className="text-5xl font-extrabold text-center bg-gradient-to-r from-[#915EFF] via-[#7dd3fc] to-[#00c8ff] bg-clip-text text-transparent">
        Contact Me
      </h2>
      <div className="w-4/5 h-[2px] bg-gradient-to-r from-[#915EFF] via-[#bf61ff] to-[#00c8ff] rounded-full opacity-60" />

      {/* Container Formulaire + Planète */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
        {/* Formulaire */}
        <div
          className="flex-1 max-w-lg w-full rounded-2xl p-8 shadow-lg"
          style={{
            background: "rgba(17, 17, 24, 0.88)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(145,94,255,0.25)",
          }}
        >
          <Header useMotion={false} {...config.contact} className="text-center text-1xl text-white" />

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            {Object.keys(config.contact.form).map((input) => {
              const { span, placeholder } =
                config.contact.form[input as keyof typeof config.contact.form];
              const Component = input === "message" ? "textarea" : "input";

              return (
                <label key={input} className="flex flex-col">
                  <span className="mb-2 font-medium text-white">{span}</span>
                  <Component
                    type={input === "email" ? "email" : "text"}
                    name={input}
                    value={form[input as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="bg-[rgba(0,0,0,0.5)] placeholder-gray-300 border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-3 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
                    {...(input === "message" && { rows: 5 })}
                  />
                </label>
              );
            })}

            <button
              type="submit"
              className="bg-gradient-to-r from-[#915EFF] via-[#7dd3fc] to-[#00c8ff] text-white font-semibold py-3 px-8 rounded-xl shadow-md mt-3 self-center transition hover:scale-105"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>

        {/* Planète */}
        <div className="w-full md:flex-1 h-80 sm:h-[350px] md:h-[450px] lg:h-[500px]">
          <EarthCanvas />
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
