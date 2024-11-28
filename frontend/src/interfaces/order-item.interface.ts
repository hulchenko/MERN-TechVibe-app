import { ProductInterface } from "./product.interface";

export interface OrderItem {
  _id?: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: ProductInterface;
  countInStock: number;
}
