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

let __uid = 0;

const nextUid = () => ++__uid;

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
  const [generated] = React.useState(() => `uid-${nextUid()}`);
  const resolvedId = id ?? (name ? `${name}-${generated}` : generated);
  if (type === "select" && options) {
    return (
      <select
        id={resolvedId}
        name={name}
        value={value as unknown as string | string[]}
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
        id={resolvedId}
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
      id={resolvedId}
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
