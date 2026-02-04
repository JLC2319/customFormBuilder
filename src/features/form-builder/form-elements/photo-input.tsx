import { useState, useEffect } from 'react';

const photoInput = ({
  label,
  description,
  required,
  formFieldId,
  fileTypes,
  defaultValue,
  onChange,
}: {
  label: string;
  description?: string;
  required?: boolean;
  formFieldId: string;
  fileTypes?: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const defaultPhotoTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const acceptTypes = fileTypes && fileTypes.length > 0 ? fileTypes : defaultPhotoTypes;

  // Load existing photo from defaultValue (base64)
  useEffect(() => {
    if (defaultValue && defaultValue.startsWith('data:image')) {
      setPreviewUrl(defaultValue);
    }
  }, [defaultValue]);

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onChange?.('');
  };

  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      
      {previewUrl ? (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px', color: '#22c55e', fontSize: '14px' }}>
            ✓ Photo uploaded
          </div>
          <img 
            src={previewUrl} 
            alt="Photo preview" 
            style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', display: 'block', marginBottom: '10px' }}
          />
          <button 
            type="button"
            onClick={handleRemovePhoto}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            Change Photo
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            id={formFieldId}
            name={label}
            required={required}
            accept={acceptTypes.join(',')}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setPreviewUrl(previewUrl);
                
                // Convert file to base64 for storage
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  onChange?.(base64String);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <span>Accepted formats: {acceptTypes.join(', ')}</span>
        </>
      )}
    </>
  );
};
export default photoInput;
