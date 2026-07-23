export interface BrandImageFile {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
}

export interface BrandImage {
  id: string;
  entityId?: string;
  imageType: string;
  order: number | null;
  file: BrandImageFile;
}

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  images: BrandImage[];
}
