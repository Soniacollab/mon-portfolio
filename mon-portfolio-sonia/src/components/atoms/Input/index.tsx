interface InputProps {
  name?: string;
  type?: string; // "text", "checkbox", etc.
  placeholder?: string;
  value?: string;
  title?: string;
  checked?: boolean; // Pour les checkbox
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  isTextarea?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  type = "text",
  placeholder,
  value,
  checked,
  title,
  onChange,
  className = "",
  isTextarea = false,
  
}) => {
  if (isTextarea) {
    return (
      <textarea
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
      name={name}
      type={type}
      placeholder={placeholder}
      value={type === "checkbox" ? undefined : value}
      checked={type === "checkbox" ? checked : undefined}
      onChange={onChange}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Input;
