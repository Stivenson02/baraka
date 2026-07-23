export type ContactListRuleType = "REQUIRED" | "UNIQUE";

export type ContactListRuleField =
  | "PHONE"
  | "EMAIL"
  | "DOCUMENT"
  | "ADDRESS"
  | "COMPANY_NAME"
  | "COUNTRY"
  | "CITY";

export interface ContactListRule {
  type: ContactListRuleType;
  field: ContactListRuleField;
  active: boolean;
}

export interface ContactList {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  rules: ContactListRule[];
  createdAt: string;
  updatedAt: string;
}

export type ContactType = "LEAD" | "CUSTOMER" | "SUPPLIER";
export type ContactTemperature = "HOT" | "WARM" | "COLD";
export type ContactAudienceType = "B2B" | "B2C";
export type ContactSource = "MANUAL" | "IMPORT" | "FORM" | "API";

export interface ContactPhone {
  label?: string | null;
  number: string;
  countryCode?: string | null;
  extension?: string | null;
  isPrimary?: boolean;
  isWhatsapp?: boolean;
  active?: boolean;
}

export interface ContactEmail {
  label?: string | null;
  email: string;
  isPrimary?: boolean;
  active?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  contactType: ContactType;
  temperature: ContactTemperature;
  audienceType: ContactAudienceType;
  source: ContactSource;
  active: boolean;
  phones: ContactPhone[];
  emails: ContactEmail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactListInput {
  name: string;
  description?: string | null;
  active?: boolean;
  rules?: ContactListRule[];
}

export interface CreateContactInput {
  formType?: "newsletter";
  name: string;
  notes?: string | null;
  contactType?: ContactType;
  temperature?: ContactTemperature;
  audienceType?: ContactAudienceType;
  source?: ContactSource;
  active?: boolean;
  phones?: ContactPhone[];
  emails?: ContactEmail[];
}
