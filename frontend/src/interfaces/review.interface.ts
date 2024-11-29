import { UserInterface } from "./user.interface";

export interface ReviewInterface {
  rating: number;
  comment: string;
  _id?: string;
  productId?: string;
  user?: UserInterface;
  name?: string;
  createdAt?: string;
}
