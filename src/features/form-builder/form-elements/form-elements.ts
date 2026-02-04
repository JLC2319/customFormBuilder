import booleanInput from "./boolean-input";
import dateInput from "./date-input";
import fileInput from "./file-input";
import locationInput from "./location-input";
import measurementInput from "./measurement-input";
import numberInput from "./number-input";
import photoInput from "./photo-input";
import rfiInput from "./rfi-input";
import selectInput from "./select-input";
import stringInput from "./string-input";

const formElements = {
  'boolean': booleanInput,
  'date': dateInput,
  'file': fileInput,
  'location': locationInput,
  'measurement': measurementInput,
  'number': numberInput,  
  'photo': photoInput,
  'request for information': rfiInput,
  'select': selectInput,
  'string': stringInput,
};

export default formElements;