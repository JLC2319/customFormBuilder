const rfiInput = ({
  label,
  description,
  required,
  defaultValue,
  formFieldId,
  onChange,
}: {
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  formFieldId: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      <textarea
        id={formFieldId}
        defaultValue={defaultValue}
        name={label}
        required={required}
        placeholder={description || "Enter your request for information"}
        rows={4}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </>
  );
};
export default rfiInput;
