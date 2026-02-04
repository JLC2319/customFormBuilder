const selectInput = ({
  label,
  description,
  required,
  defaultValue,
  formFieldId,
  options,
  onChange,
}: {
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  formFieldId: string;
  options?: string[];
  onChange?: (value: string) => void;
}) => {
  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      <select
        id={formFieldId}
        defaultValue={defaultValue}
        name={label}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Select an option...</option>
        {options?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};
export default selectInput;
