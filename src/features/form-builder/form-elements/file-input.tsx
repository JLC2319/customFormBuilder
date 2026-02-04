import { useState, useEffect } from 'react';

const fileInput = ({
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
  const [fileData, setFileData] = useState<{ name: string; data: string } | null>(null);

  // Load existing file from defaultValue (base64)
  useEffect(() => {
    if (defaultValue && defaultValue.startsWith('data:')) {
      // Extract filename from base64 data if possible, or use generic name
      const match = defaultValue.match(/^data:([^;]+);/);
      const mimeType = match ? match[1] : 'application/octet-stream';
      const extension = mimeType.split('/')[1] || 'file';
      setFileData({ name: `saved-file.${extension}`, data: defaultValue });
    }
  }, [defaultValue]);

  const handleRemoveFile = () => {
    setFileData(null);
    onChange?.('');
  };

  return (
    <>
      <label htmlFor={formFieldId}>{label}</label>
      {description && <p>{description}</p>}
      
      {fileData ? (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px', color: '#22c55e', fontSize: '14px' }}>
            ✓ File uploaded: {fileData.name}
          </div>
          <button 
            type="button"
            onClick={handleRemoveFile}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            Change File
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            id={formFieldId}
            name={label}
            required={required}
            accept={fileTypes?.join(',')}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Convert file to base64 for storage
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  setFileData({ name: file.name, data: base64String });
                  onChange?.(base64String);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {fileTypes && fileTypes.length > 0 && (
            <span>Accepted file types: {fileTypes.join(', ')}</span>
          )}
        </>
      )}
    </>
  );
};
export default fileInput;
