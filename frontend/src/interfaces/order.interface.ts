import { OrderItem } from "./order-item.interface";
import { PaymentResult } from "./payment-result.interface";
import { Shipping } from "./shipping.interface";
import { User } from "./user.interface";

export interface OrderInterface {
  _id?: string;
  user: User;
  orderItems: OrderItem[];
  shippingAddress: Shipping;
  paymentMethod: string;
  paymentResult: PaymentResult;
  itemsPrice: string; // this
  taxPrice: string; // this
  shippingPrice: string; // this
  totalPrice: string; // this
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}
