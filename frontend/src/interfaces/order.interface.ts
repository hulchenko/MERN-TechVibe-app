import { OrderItemInterface } from "./order-item.interface";
import { PaymentResultInterface } from "./payment-result.interface";
import { ShippingInterface } from "./shipping.interface";
import { UserInterface } from "./user.interface";

export interface OrderInterface {
  orderItems: OrderItemInterface[];
  shippingAddress: ShippingInterface;
  paymentMethod: string;
  paymentResult: PaymentResultInterface;
  itemsPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  _id?: string;
  user?: UserInterface;
  createdAt?: string;
}
