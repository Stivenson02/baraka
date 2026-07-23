export interface CategoryImageFile {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
}

export interface CategoryImage {
  id: string;
  entityId?: string;
  imageType?: string;
  order?: number | null;
  file: CategoryImageFile;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  images?: CategoryImage[];
}

export interface HomeCategoryImage {
  id: string;
  entityId: string;
  file: CategoryImageFile;
}

export interface HomeCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  image: HomeCategoryImage | null;
}

export interface StorefrontCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number;
}
