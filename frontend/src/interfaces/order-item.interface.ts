import { ProductInterface } from "./product.interface";

export interface OrderItemInterface {
  _id?: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: ProductInterface;
  countInStock: number;
}
