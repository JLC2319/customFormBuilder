const numberInput = ({
  label,
  description,
  required,
  defaultValue,
  formFieldId,
  constraints,
  onChange,
}: {
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: number;
  formFieldId: string;
  constraints?: {
    min?: number;
    max?: number;
    neq?: number;
  };
  onChange?: (value: number) => void;
}) => {
  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      <input
        type="number"
        id={formFieldId}
        defaultValue={defaultValue}
        name={label}
        required={required}
        placeholder={description}
        min={constraints?.min}
        max={constraints?.max}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
      />
      {constraints?.neq !== undefined && (
        <span>Value must not equal {constraints.neq}</span>
      )}
    </>
  );
};
export default numberInput;
