import { User } from "./user.interface";

export interface Review {
  user: User;
  name: string;
  rating: number;
  comment: string;
}
