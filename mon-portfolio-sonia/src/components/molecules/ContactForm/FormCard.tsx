import React, { useId } from "react";
import FormRow, { FormRowProps } from "./FormRow";
import { Button } from "../../atoms";
import FileInput from "../../atoms/FileInput";

interface FormCardProps {
  title: string;
  fields: FormRowProps[];
  // Support either a single fileField (legacy) or multiple fileFields
  fileField?: {
    name: string;
    label: string;
    preview?: string | null;
    accept?: string;
    value?: File | string | null;
    showRemove?: boolean;
    showPreview?: boolean;
  };
  fileFields?: Array<{
    name: string;
    label: string;
    preview?: string | null;
    accept?: string;
    value?: File | string | null;
    showRemove?: boolean;
    showPreview?: boolean;
  }>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
  hideSubmit?: boolean;
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  (
    {
      title,
      fields,
      fileField,
      fileFields,
      onChange,
      onSubmit,
      submitLabel = "Envoyer",
      hideSubmit = false,
    },
    ref
  ) => {
    const formId = useId();

    return (
      <div ref={ref} className="p-6 border rounded-lg bg-[rgba(0,0,0,0.35)] flex flex-col gap-4 shadow-md">
        <h2 className="text-white text-xl font-semibold">{title}</h2>

        {fields.map((field) => (
          <FormRow key={`${formId}-${field.name}`} {...field} onChange={onChange} />
        ))}

        {fileFields && fileFields.length > 0 ? (
          fileFields.map((f) => (
            <FileInput
              key={f.name}
              name={f.name}
              label={f.label}
              preview={f.preview ?? null}
              value={f.value}
              accept={f.accept}
              onChange={onChange}
              showRemove={f.showRemove}
              showPreview={typeof f.showPreview === "boolean" ? f.showPreview : true}
            />
          ))
        ) : fileField ? (
          <FileInput
            name={fileField.name}
            label={fileField.label}
            preview={fileField.preview ?? null}
            value={fileField.value}
            accept={fileField.accept}
            onChange={onChange}
            showRemove={fileField.showRemove}
            showPreview={typeof fileField.showPreview === "boolean" ? fileField.showPreview : true}
          />
        ) : null}

        {!hideSubmit && (
          <Button
            onClick={onSubmit}
            label={submitLabel}
            className="mt-4 self-start bg-[#915EFF] hover:bg-[#7a4ed9] text-white font-semibold"
          />
        )}
      </div>
    );
  }
);

FormCard.displayName = "FormCard";

export default FormCard;
