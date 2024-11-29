import { ReviewInterface } from "./review.interface";
import { UserInterface } from "./user.interface";

export interface ProductInterface {
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: string;
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
