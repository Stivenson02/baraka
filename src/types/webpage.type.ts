export type WebSectionType =
  | "HERO"
  | "ABOUT"
  | "SERVICES"
  | "GALLERY"
  | "CONTACT";

export type WebPageFieldType = "TEXT" | "TEXTAREA" | "IMAGE" | "NUMBER" | "URL";

export interface WebPageFile {
  id: string;
  url: string;
  mimeType: string;
  width: number | null;
  height: number | null;
}

export interface WebPageField {
  id: string;
  key: string;
  type: WebPageFieldType;
  value: string | null;
  order: number | null;
  file: WebPageFile | null;
}

export interface WebPageSection {
  id: string;
  name: string;
  type: WebSectionType;
  order: number;
  fields: WebPageField[];
}

export interface WebPageResponse {
  webPageId: string;
  sections: Record<string, WebPageSection>;
}
