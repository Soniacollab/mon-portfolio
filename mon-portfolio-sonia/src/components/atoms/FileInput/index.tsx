import React, { useEffect, useState } from "react";

export interface FileInputWithPreviewProps {
  name: string;
  label?: string;
  id?: string;
  value?: File | string | null;
  preview?: string | null;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  previewAlt?: string;
  showRemove?: boolean;
  showPreview?: boolean;
}

export default function FileInputWithPreview({
  id,
  name,
  label,
  value,
  preview,
  accept,
  onChange,
  className = "",
  previewAlt,
  showRemove = true,
  showPreview = true,
}: FileInputWithPreviewProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(preview || null);

  useEffect(() => {
    let t: number | null = null;
    // Si le parent fournit une chaîne de preview, la privilégier (différer la mise à jour d'état)
    if (preview) {
      t = window.setTimeout(() => setLocalPreview(preview), 0);
      return () => {
        if (t !== null) clearTimeout(t);
      };
    }

    // Si `value` est un File, créer un object URL (différer la mise à jour d'état)
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      t = window.setTimeout(() => setLocalPreview(url), 0);
      return () => {
        if (t !== null) clearTimeout(t);
        URL.revokeObjectURL(url);
      };
    }

    // sinon effacer (différer)
    t = window.setTimeout(() => setLocalPreview(null), 0);
    return () => {
      if (t !== null) clearTimeout(t);
    };
  }, [preview, value]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    // Déclenche un événement de changement synthétique pour vider le champ dans les form hooks
    const target = { name, value: "" } as unknown as HTMLInputElement;
    onChange({ target } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];

      // If accept was provided, validate strictly and reject mismatches (prevents .gif etc.)
      if (accept) {
        const parts = accept.split(",").map((p) => p.trim().toLowerCase());
        const matches = parts.some((p) => {
          if (!p) return false;
          // exact mime
          if (p.includes("/")) {
            if (p.endsWith("/*")) {
              return file.type.startsWith(p.split("/")[0]);
            }
            return file.type === p;
          }
          // extension like .svg
          if (p.startsWith(".")) {
            return file.name.toLowerCase().endsWith(p);
          }
          return false;
        });

        if (!matches) {
          // Gentle user feedback
          window.alert("Format de fichier non supporté pour ce champ.");
          // clear input value so parent doesn't receive invalid file
          e.currentTarget.value = "";
          return;
        }
      }
    }

    onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || /^(data:image|blob:)/.test(url);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id || `file-${name}`} className="mb-2 font-medium text-white">
          {label}
        </label>
      )}

      <input
        id={id || `file-${name}`}
        type="file"
        name={name}
        accept={accept}
        onChange={handleInputChange}
        title={`Upload ${label || name}`}
        aria-label={`Upload ${label || name}`}
        className="bg-[rgba(0,0,0,0.5)] border border-[rgba(145,94,255,0.25)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#915EFF] focus:ring-1 focus:ring-[#915EFF] transition"
      />

        {localPreview && showPreview && (
        <div className="mt-2 flex items-start gap-2">
          {typeof value === "string" || typeof localPreview === "string" ? (
            isImage(localPreview) ? (
              <img
                src={localPreview}
                alt={previewAlt || `Preview of ${label || name}`}
                className="w-40 h-40 object-cover rounded border border-gray-400"
              />
            ) : (
              <div className="flex flex-col bg-[rgba(255,255,255,0.04)] rounded p-2 border border-gray-600">
                <a href={localPreview} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 underline">
                  {localPreview.split("/").pop() || localPreview}
                </a>
              </div>
            )
          ) : value instanceof File ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-white">{value.name}</div>
            </div>
          ) : null}

          {showRemove && (
            <button
              onClick={handleRemove}
              className="text-sm text-red-400 hover:text-red-500 mt-1"
              aria-label={`Remove ${label || name}`}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
