import { useState } from "react";
import {
  type Form,
  type FormField,
  type FormResponse,
  type Forms,
  type FormResponses,
} from "./types";
import useLocalStorage from "./hooks/UseLocalStorage";
import formElements from "./form-elements/form-elements";

const FormViewer = () => {
  const [forms] = useLocalStorage<Forms>("FORMS", []);
  const [responses, setResponses] = useLocalStorage<FormResponses>(
    "FORM_RESPONSES",
    []
  );
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [currentResponse, setCurrentResponse] = useState<{
    [fieldId: string]: any;
  }>({});

  // Select a form to fill out
  const selectForm = (form: Form) => {
    setSelectedForm(form);
    // Initialize with default values or existing response
    const existingResponse = responses?.find((r) => r.formId === form._id);
    if (existingResponse) {
      const responseData: { [fieldId: string]: any } = {};
      existingResponse.datums.forEach((datum) => {
        responseData[datum._id] = datum.value;
      });
      setCurrentResponse(responseData);
    } else {
      // Initialize with default values from form fields
      const initialResponse: { [fieldId: string]: any } = {};
      form.formFields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialResponse[field._id] = field.defaultValue;
        }
      });
      setCurrentResponse(initialResponse);
    }
  };

  // Update a field value in the current response
  const updateFieldValue = (fieldId: string, value: any) => {
    setCurrentResponse({
      ...currentResponse,
      [fieldId]: value,
    });
  };

  // Save the response to localStorage
  const saveResponse = () => {
    if (!selectedForm) return;

    const formResponse: FormResponse = {
      formId: selectedForm._id,
      datums: Object.entries(currentResponse).map(([_id, value]) => ({
        _id,
        value,
      })),
    };

    const existingResponseIndex = responses?.findIndex(
      (r) => r.formId === selectedForm._id
    );

    if (existingResponseIndex !== undefined && existingResponseIndex >= 0) {
      // Update existing response
      const updatedResponses = [...(responses || [])];
      updatedResponses[existingResponseIndex] = formResponse;
      setResponses(updatedResponses);
    } else {
      // Add new response
      setResponses([...(responses || []), formResponse]);
    }

    alert("Response saved successfully!");
  };

  // Render a form field based on its type
  const renderFormField = (field: FormField) => {
    const FieldComponent = formElements[field.dataType];

    if (!FieldComponent) {
      return (
        <div key={field._id} className="form-field">
          <label>{field.label}</label>
          <p>Unsupported field type: {field.dataType}</p>
        </div>
      );
    }

    return (
      <div key={field._id} className="form-field">
        <FieldComponent
          label={field.label}
          description={field.description}
          required={field.required}
          defaultValue={currentResponse[field._id]}
          formFieldId={field._id}
          options={field.options}
          constraints={field.constraints}
          units={field.units}
          fileTypes={field.fileTypes}
          onChange={(value: any) => updateFieldValue(field._id, value)}
        />
      </div>
    );
  };

  // Go back to form list
  const backToList = () => {
    setSelectedForm(null);
    setCurrentResponse({});
  };

  // View saved responses
  const viewResponses = () => {
    if (!responses || responses.length === 0) {
      return (
        <div className="responses-section">
          <h3>No Responses Yet</h3>
          <p>Fill out a form to save your first response.</p>
        </div>
      );
    }

    return (
      <div className="responses-section">
        <h3>Saved Responses ({responses.length})</h3>
        <div className="responses-list">
          {responses.map((response, index) => {
            const form = forms?.find((f) => f._id === response.formId);
            return (
              <div key={index} className="response-card">
                <h4>{form?.name || "Unknown Form"}</h4>
                <p>Fields completed: {response.datums.length}</p>
                <button onClick={() => form && selectForm(form)}>
                  View/Edit
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="form-viewer-container">
      {!selectedForm ? (
        // Form list view
        <div className="forms-list-view">
          <h2>Available Forms</h2>

          {forms && forms.length > 0 ? (
            <div className="forms-grid">
              {forms.map((form) => {
                const hasResponse = responses?.some(
                  (r) => r.formId === form._id
                );
                return (
                  <div
                    key={form._id}
                    className={`form-card ${hasResponse ? "has-response" : ""}`}
                  >
                    <h3>{form.name}</h3>
                    <p>{form.description}</p>
                    <p className="form-meta">
                      {form.formFields.length} field
                      {form.formFields.length !== 1 ? "s" : ""}
                    </p>
                    {hasResponse && (
                      <span className="response-badge">✓ Responded</span>
                    )}
                    <button
                      onClick={() => selectForm(form)}
                      className="btn-fill-form"
                    >
                      {hasResponse ? "View/Edit Response" : "Fill Form"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">
              No forms available. Create a form in the Form Builder first.
            </p>
          )}

          {responses && responses.length > 0 && (
            <div className="responses-summary">{viewResponses()}</div>
          )}
        </div>
      ) : (
        // Form filling view
        <div className="form-filling-view">
          <div className="form-header">
            <button onClick={backToList} className="btn-back">
              ← Back to Forms
            </button>
            <div className="form-title-section">
              <h2>{selectedForm.name}</h2>
              {selectedForm.description && <p>{selectedForm.description}</p>}
            </div>
            <button onClick={saveResponse} className="btn-save-response">
              Save Response
            </button>
          </div>

          <div className="form-fields-container">
            {selectedForm.formFields.length > 0 ? (
              selectedForm.formFields.map((field) => renderFormField(field))
            ) : (
              <p className="empty-state">This form has no fields yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormViewer;