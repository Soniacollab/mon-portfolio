import React from "react";
import { Typography, Input } from "../../atoms";
import { Textarea } from "../../atoms";

interface FormRowProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  isTextarea = false,
}) => {
  const Component = isTextarea ? Textarea : Input;

  return (
    <div className="flex flex-col">
      <Typography variant="p" className="mb-2 font-medium text-white">
        {label}
      </Typography>
      <Component
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="bg-[rgba(0,0,0,0.5)] placeholder-gray-300 border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-3 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
        {...(isTextarea && { rows: 5 })}
      />
    </div>
  );
};

export default FormRow;
