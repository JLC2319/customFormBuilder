type Forms = Form[];
type FormResponses = FormResponse[];

type Form = {
  _id: string;
  name: string;
  description?: string;
  assignees?: string[];
  meta: {
    creatorId: string;
    isActive: boolean;
    created: Date;
    modified: Date;
    locations?: (string | null)[];
  };
  formFields: FormField[];
  discussion?: DiscussionItem[];
};

type SupportedDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "measurement"
  | "file"
  | "location"
  | "photo"
  | "request for information";

type FormField = {
  _id: string;
  dataType: SupportedDataType;
  label: string;
  description?: string;
  required?: boolean;
  options?: string[]; // for 'select' dataType
  constraints?: {
    min?: number;
    max?: number;
    neq?: number;
  }; //only for 'number' and measurement dataType;
  defaultValue?: any;
  units?: string; // only for 'measurement' dataType
  fileTypes?: string[]; // only for 'file' and 'photo' dataType
};

type DiscussionItem = {
  creatorId: string;
  sendDate: Date;
  content: string;
};

type FormResponse = {
  formId: string;
  datums: { _id: string; value: any }[];
};

type User = {
  _id: string;
  name: string;
};

export {
  type Form,
  type FormField,
  type DiscussionItem,
  type FormResponse,
  type User,
  type Forms,
  type FormResponses,
  type SupportedDataType,
};
