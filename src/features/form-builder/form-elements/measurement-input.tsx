const measurementInput = ({
  label,
  description,
  required,
  defaultValue,
  formFieldId,
  constraints,
  units,
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
  units?: string;
  onChange?: (value: number) => void;
}) => {
  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      <div className="flex items-center gap-2">
        <input
          type="number"
          id={formFieldId}
          defaultValue={defaultValue}
          name={label}
          required={required}
          placeholder={description}
          min={constraints?.min}
          max={constraints?.max}
          step="any"
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
        />
        {units && <span>{units}</span>}
      </div>
      {constraints?.neq !== undefined && (
        <span>Value must not equal {constraints.neq}</span>
      )}
    </>
  );
};
export default measurementInput;
