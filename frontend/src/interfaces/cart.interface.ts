import { OrderInterface } from "./order.interface";

export interface CartInterface {
  cartItems: OrderInterface[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}
