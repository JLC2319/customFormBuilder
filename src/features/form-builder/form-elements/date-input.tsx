const dateInput = ({
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
      <input
        type="date"
        id={formFieldId}
        defaultValue={defaultValue}
        name={label}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </>
  );
};
export default dateInput;
