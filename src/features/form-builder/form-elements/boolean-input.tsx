const booleanInput = ({
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
  defaultValue?: boolean;
  formFieldId: string;
  onChange?: (value: boolean) => void;
}) => {
  return (
    <>
      <div>
        <input
          type="checkbox"
          id={formFieldId}
          defaultChecked={defaultValue}
          name={label}
          required={required}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <label htmlFor={formFieldId}>{label}</label>
      </div>
      {description && <p>{description}</p>}
    </>
  );
};
export default booleanInput;
