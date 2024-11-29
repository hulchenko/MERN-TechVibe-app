import { OrderItemInterface } from "./order-item.interface";
import { ProductInterface } from "./product.interface";
import { OrderInterface } from "./order.interface";

export interface CartInterface extends ProductInterface, OrderInterface {
  cartItems: OrderItemInterface[];
}
