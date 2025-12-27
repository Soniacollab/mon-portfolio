import React from "react";

export interface InputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string | string[];
  title?: string;
  checked?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  className?: string;
  isTextarea?: boolean;
  options?: { value: string; label: string }[]; // pour select
  multiple?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  checked,
  title,
  onChange,
  className = "",
  isTextarea = false,
  options,
  multiple = false,
}) => {
  if (type === "select" && options) {
    return (
      <select
        id={id}
        name={name}
        value={value as any}
        onChange={onChange}
        title={title}
        multiple={multiple}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (isTextarea) {
    return (
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        title={title}
        onChange={onChange}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    );
  }

  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={type === "checkbox" ? undefined : value}
      checked={type === "checkbox" ? checked : undefined}
      title={title}
      onChange={onChange}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Input;
