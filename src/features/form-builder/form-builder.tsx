import { useState } from "react";
import {
  type Form,
  type FormField,
  type Forms,
  type SupportedDataType,
} from "./types";
import useLocalStorage from "./hooks/UseLocalStorage";

const FormBuilder = () => {
  const [forms, setForms] = useLocalStorage<Forms>("FORMS", []);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Create a new form
  const createNewForm = () => {
    const newForm: Form = {
      _id: crypto.randomUUID(),
      name: "Untitled Form",
      description: "",
      meta: {
        creatorId: "user-1",
        isActive: true,
        created: new Date(),
        modified: new Date(),
      },
      formFields: [],
    };
    setCurrentForm(newForm);
    setIsEditing(true);
  };

  // Add a new field to the current form
  const addFormField = (dataType: SupportedDataType) => {
    if (!currentForm) return;

    const newField: FormField = {
      _id: crypto.randomUUID(),
      dataType: dataType,
      label: `New ${dataType} field`,
      description: "",
      required: false,
    };

    setCurrentForm({
      ...currentForm,
      formFields: [...currentForm.formFields, newField],
    });
  };

  // Update a field in the current form
  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    if (!currentForm) return;

    setCurrentForm({
      ...currentForm,
      formFields: currentForm.formFields.map((field) =>
        field._id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  // Remove a field from the current form
  const removeFormField = (fieldId: string) => {
    if (!currentForm) return;

    setCurrentForm({
      ...currentForm,
      formFields: currentForm.formFields.filter(
        (field) => field._id !== fieldId
      ),
    });
  };

  // Save the current form to localStorage
  const saveForm = () => {
    if (!currentForm) return;

    const updatedForm = {
      ...currentForm,
      meta: {
        ...currentForm.meta,
        modified: new Date(),
      },
    };

    const existingFormIndex = forms?.findIndex(
      (f) => f._id === updatedForm._id
    );

    if (existingFormIndex !== undefined && existingFormIndex >= 0) {
      // Update existing form
      const updatedForms = [...(forms || [])];
      updatedForms[existingFormIndex] = updatedForm;
      setForms(updatedForms);
    } else {
      // Add new form
      setForms([...(forms || []), updatedForm]);
    }

    setIsEditing(false);
    setCurrentForm(null);
  };

  // Edit an existing form
  const editForm = (form: Form) => {
    setCurrentForm(form);
    setIsEditing(true);
  };

  // Delete a form
  const deleteForm = (formId: string) => {
    setForms(forms?.filter((f) => f._id !== formId) || []);
  };

  // Cancel editing
  const cancelEditing = () => {
    setCurrentForm(null);
    setIsEditing(false);
  };

  const dataTypes: SupportedDataType[] = [
    "string",
    "number",
    "boolean",
    "date",
    "select",
    "measurement",
    "file",
    "location",
    "photo",
    "request for information",
  ];

  return (
    <div className="form-builder-container">
      {!isEditing ? (
        // List of forms view
        <div className="forms-list">
          <div className="forms-header">
            <h2>Forms</h2>
            <button className="btn-add-form" onClick={createNewForm}>
              + New Form
            </button>
          </div>

          <div className="forms-grid">
            {forms && forms.length > 0 ? (
              forms.map((form) => (
                <div key={form._id} className="form-card">
                  <h3>{form.name}</h3>
                  <p>{form.description}</p>
                  <p className="form-meta">
                    Fields: {form.formFields.length} | Created:{" "}
                    {new Date(form.meta.created).toLocaleDateString()}
                  </p>
                  <div className="form-actions">
                    <button onClick={() => editForm(form)}>Edit</button>
                    <button onClick={() => deleteForm(form._id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">
                No forms yet. Click "+ New Form" to create one.
              </p>
            )}
          </div>
        </div>
      ) : (
        // Form editor view
        <div className="form-editor">
          <div className="editor-header">
            <input
              type="text"
              value={currentForm?.name || ""}
              onChange={(e) =>
                setCurrentForm(
                  currentForm
                    ? { ...currentForm, name: e.target.value }
                    : null
                )
              }
              placeholder="Form Name"
              className="form-name-input"
            />
            <div className="editor-actions">
              <button className="btn-cancel" onClick={cancelEditing}>
                Cancel
              </button>
              <button className="btn-save" onClick={saveForm}>
                Save Form
              </button>
            </div>
          </div>

          <textarea
            value={currentForm?.description || ""}
            onChange={(e) =>
              setCurrentForm(
                currentForm
                  ? { ...currentForm, description: e.target.value }
                  : null
              )
            }
            placeholder="Form Description"
            className="form-description-input"
          />

          <div className="form-fields">
            <h3>Form Fields</h3>

            {currentForm?.formFields.map((field, index) => (
              <div key={field._id} className="field-editor">
                <div className="field-header">
                  <span className="field-number">Field {index + 1}</span>
                  <span className="field-type">{field.dataType}</span>
                  <button
                    className="btn-remove-field"
                    onClick={() => removeFormField(field._id)}
                  >
                    ×
                  </button>
                </div>

                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateFormField(field._id, { label: e.target.value })
                  }
                  placeholder="Field Label"
                  className="field-label-input"
                />

                <input
                  type="text"
                  value={field.description || ""}
                  onChange={(e) =>
                    updateFormField(field._id, { description: e.target.value })
                  }
                  placeholder="Field Description (optional)"
                  className="field-description-input"
                />

                <label className="field-required">
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) =>
                      updateFormField(field._id, { required: e.target.checked })
                    }
                  />
                  Required
                </label>

                {field.dataType === "select" && (
                  <input
                    type="text"
                    value={field.options?.join(", ") || ""}
                    onChange={(e) =>
                      updateFormField(field._id, {
                        options: e.target.value.split(",").map((o) => o.trim()),
                      })
                    }
                    placeholder="Options (comma-separated)"
                    className="field-options-input"
                  />
                )}

                {field.dataType === "measurement" && (
                  <input
                    type="text"
                    value={field.units || ""}
                    onChange={(e) =>
                      updateFormField(field._id, { units: e.target.value })
                    }
                    placeholder="Units (e.g., meters, kg)"
                    className="field-units-input"
                  />
                )}

                {(field.dataType === "file" || field.dataType === "photo") && (
                  <input
                    type="text"
                    value={field.fileTypes?.join(", ") || ""}
                    onChange={(e) =>
                      updateFormField(field._id, {
                        fileTypes: e.target.value.split(",").map((t) => t.trim()),
                      })
                    }
                    placeholder="File types (comma-separated, e.g., .jpg, .png)"
                    className="field-filetypes-input"
                  />
                )}
              </div>
            ))}

            <div className="add-field-section">
              <h4>Add New Field</h4>
              <div className="field-type-buttons">
                {dataTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => addFormField(type)}
                    className="btn-add-field"
                  >
                    + {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
