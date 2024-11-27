import { Review } from "./review.interface";
import { User } from "./user.interface";

export interface Product {
  user: User;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}
