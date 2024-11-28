import { OrderItem } from "./order-item.interface";
import { PaymentResult } from "./payment-result.interface";
import { Shipping } from "./shipping.interface";
import { UserInterface } from "./user.interface";

export interface OrderInterface {
  orderItems: OrderItem[];
  shippingAddress: Shipping;
  paymentMethod: string;
  paymentResult: PaymentResult;
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

// TODO
// {
//     "shippingAddress": {
//         "address": "123 Main Street",
//         "city": "Calgary",
//         "postalCode": "T2A 1N1",
//         "country": "Canada"
//     },
//     "_id": "65bec81f8fd5aeac917c085b",
//     "user": {
//         "_id": "67464b505dd30ccbce686c57",
//         "name": "Admin User"
//     },
//     "orderItems": [
//         {
//             "name": "Airpods Wireless Bluetooth Headphones",
//             "qty": 1,
//             "image": "/images/airpods.jpg",
//             "price": 89.99,
//             "product": "6598521786d93708a8525fa6",
//             "_id": "65bec81f8fd5aeac917c085c"
//         }
//     ],
//     "paymentMethod": "PayPal",
//     "itemsPrice": "89.99",
//     "taxPrice": "4.5",
//     "shippingPrice": "10",
//     "totalPrice": "104.49",
//     "isPaid": true,
//     "isDelivered": true,
//     "createdAt": "2024-02-03T23:11:27.523Z",
//     "updatedAt": "2024-11-28T21:00:32.360Z",
//     "__v": 0,
//     "paidAt": "2024-02-10T07:56:37.422Z",
//     "deliveredAt": "2024-11-28T21:00:32.358Z"
// }
