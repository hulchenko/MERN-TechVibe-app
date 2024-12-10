import { ReviewInterface } from "./review.interface";
import { UserInterface } from "./user.interface";

export interface ProductInterface {
  name: string;
  image: string;
  genre: string;
  description: string;
  price: number;
  countInStock: number;
  qty?: number;
  _id?: string;
  productId?: string;
  user?: UserInterface;
  reviews?: ReviewInterface[];
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPaginationRes {
  products: ProductInterface[];
  page: number;
  pages: number;
}

export interface ProductFormValidators {
  name: boolean;
  price: boolean;
  genre: boolean;
  countInStock: boolean;
  description: boolean;
}
