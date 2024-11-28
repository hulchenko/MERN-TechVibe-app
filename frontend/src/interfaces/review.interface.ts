import { UserInterface } from "./user.interface";

export interface Review {
  _id?: string;
  user: UserInterface;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}
