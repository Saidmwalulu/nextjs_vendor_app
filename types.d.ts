export type StoreSummary = {
  id: string;
  name: string;
  url: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  verified: boolean;
  stores?: StoreSummary[];
};

export type Category = {
  id: string;
  name: string;
  image: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubCategory = {
  id: string;
  name: string;
  image: string;
  featured: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type Categories = Category[];

export type Store = {
  id?: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  status?: string;
  averageRating?: number;
  featured?: boolean;
  returnPolicy?: string | null;
  defaultShippingService?: string | null;
  defaultShippingFees?: string | null;
  defaultDeliveryTimeMin?: number | null;
  defaultDeliveryTimeMax?: number | null;
  userId: string;
}
