import React from "react";
import { Typography, Input } from "../../atoms";

interface FormRowProps {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  type?: string;
  title?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
  checked?: boolean;
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  title,
  onChange,
  isTextarea = false,
  checked,
}) => {
  const Component = Input; // atom Input gère textarea via isTextarea

  // Définir autocomplete uniquement pour input
  const autoCompleteValue = type === "password"
    ? "current-password"
    : type === "email"
    ? "email"
    : "username";

  return (
    <div className="flex flex-col">
      <Typography variant="p" className="mb-2 font-medium text-white">
        {label}
      </Typography>
      <Component
        name={name}
        type={type}
        value={value}
        title={title}
        placeholder={placeholder}
        onChange={onChange}
        isTextarea={isTextarea}
        checked={checked}
        {...(!isTextarea && { autoComplete: autoCompleteValue })}
        className="bg-[rgba(0,0,0,0.5)] placeholder-gray-300 border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-3 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
      />
    </div>
  );
};

export default FormRow;
