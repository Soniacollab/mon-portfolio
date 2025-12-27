import React, { useId } from "react";
import FormRow, { FormRowProps } from "./FormRow";
import { Button } from "../../atoms";

interface FormCardProps {
  title: string;
  fields: FormRowProps[];
  fileField?: {
    name: string;
    label: string;
    preview?: string | null;
  };
  fileFieldCV?: {
    name: string;
    label: string;
    preview?: string | null; // URL pour téléchargement
    onDownload?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
  hideSubmit?: boolean;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  fields,
  fileField,
  fileFieldCV,
  onChange,
  onSubmit,
  submitLabel = "Envoyer",
  hideSubmit = false,
}) => {
  const formId = useId();

  return (
    <div className="p-6 border rounded-lg bg-[rgba(0,0,0,0.35)] flex flex-col gap-4 shadow-md">
      <h2 className="text-white text-xl font-semibold">{title}</h2>

      {fields.map((field) => (
        <FormRow
          key={`${formId}-${field.name}`}
          {...field}
          onChange={onChange}
        />
      ))}

      {fileField && (
        <div className="flex flex-col">
          <label htmlFor={`${formId}-file-${fileField.name}`} className="mb-2 font-medium text-white">
            {fileField.label}
          </label>
          <input
            id={`${formId}-file-${fileField.name}`}
            type="file"
            name={fileField.name}
            onChange={onChange}
            title={`Upload ${fileField.label}`}
            aria-label={`Upload ${fileField.label}`}
            className="bg-[rgba(0,0,0,0.5)] border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
          />
          {fileField.preview && (
            <img
              src={fileField.preview}
              alt={`Preview of ${fileField.label}`}
              className="w-40 h-40 object-cover rounded mt-2 border border-gray-400"
            />
          )}
        </div>
      )}

      {fileFieldCV && (
        <div className="flex flex-col">
          <label htmlFor={`${formId}-file-${fileFieldCV.name}`} className="mb-2 font-medium text-white">
            {fileFieldCV.label}
          </label>
          <input
            id={`${formId}-file-${fileFieldCV.name}`}
            type="file"
            name={fileFieldCV.name}
            onChange={onChange}
            title={`Upload ${fileFieldCV.label}`}
            aria-label={`Upload ${fileFieldCV.label}`}
            className="bg-[rgba(0,0,0,0.5)] border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
          />
          {fileFieldCV.preview && (
            <a
              href={fileFieldCV.preview}
              onClick={fileFieldCV.onDownload}
              download
              className="mt-2 text-sm text-sky-400 underline"
            >
              Télécharger le CV
            </a>
          )}
        </div>
      )}

      {!hideSubmit && (
        <Button
          onClick={onSubmit}
          label={submitLabel}
          className="mt-4 self-start bg-[#915EFF] hover:bg-[#7a4ed9] text-white font-semibold"
        />
      )}
    </div>
  );
};

export default FormCard;
