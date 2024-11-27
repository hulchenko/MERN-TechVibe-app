import { Product } from "./product.interface";

export interface OrderItem {
  _id?: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Product;
}
