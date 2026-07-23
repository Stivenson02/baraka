export interface ProductImageFile {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
}

export interface ProductImage {
  id: string;
  entityId: string;
  file: ProductImageFile;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug?: string;
}

export interface ProductPrice {
  amount: number;
  unitQuantity: number;
  packagingQuantity: number;
  priceListId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  externalSku: string | null;
  slug: string;
  order: number;
  active: boolean;
  category: ProductCategory | null;
  brand: ProductBrand | null;
  image: ProductImage | null;
  imageUrl?: string | null;
  watermarkEnabled?: boolean;
  watermarkImageUrl?: string | null;
  price: ProductPrice | null;
  createdAt: string;
  updatedAt: string;
}
