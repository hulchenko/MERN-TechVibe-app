import { OrderItem } from "./order-item.interface";
import { OrderInterface } from "./order.interface";

export interface CartInterface extends OrderInterface {
  cartItems: OrderItem[];
}
