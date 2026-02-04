const fileInput = ({
  label,
  description,
  required,
  formFieldId,
  fileTypes,
  onChange,
}: {
  label: string;
  description?: string;
  required?: boolean;
  formFieldId: string;
  fileTypes?: string[];
  onChange?: (value: string) => void;
}) => {
  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      <input
        type="file"
        id={formFieldId}
        name={label}
        required={required}
        accept={fileTypes?.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange?.(file.name);
          }
        }}
      />
      {fileTypes && fileTypes.length > 0 && (
        <span>Accepted file types: {fileTypes.join(', ')}</span>
      )}
    </>
  );
};
export default fileInput;
