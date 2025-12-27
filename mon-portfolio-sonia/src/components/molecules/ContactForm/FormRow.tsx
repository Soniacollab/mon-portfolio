import React, { useId } from "react";
import { Typography } from "../../atoms";
import { InputProps } from "../../atoms/Input";
import Input from "../../atoms/Input";

export interface FormRowProps extends Omit<InputProps, "options"> {
  label: string;
  error?: string;
  options?: { value: string; label: string }[];
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  options,
  ...inputProps
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const inputId = `input-${inputProps.name}-${uniqueId}`;

  return (
    <div className="flex flex-col">
      <Typography variant="p" className="mb-2 font-medium text-white">
        <label htmlFor={inputId}>{label}</label>
      </Typography>
      <Input
        {...inputProps}
        id={inputId}
        options={options}
      />
      {inputProps.error && (
        <p className="text-red-400 text-sm mt-1">{inputProps.error}</p>
      )}
    </div>
  );
};

export default FormRow;
