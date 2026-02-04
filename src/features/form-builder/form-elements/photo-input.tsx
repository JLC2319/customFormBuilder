const photoInput = ({
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
  const defaultPhotoTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const acceptTypes = fileTypes && fileTypes.length > 0 ? fileTypes : defaultPhotoTypes;

  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      <input
        type="file"
        id={formFieldId}
        name={label}
        required={required}
        accept={acceptTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange?.(file.name);
          }
        }}
      />
      <span>Accepted formats: {acceptTypes.join(', ')}</span>
    </>
  );
};
export default photoInput;
