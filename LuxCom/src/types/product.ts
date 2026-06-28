export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt?: string;
  updatedAt?: string;
};

export type ProductFormData = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};
