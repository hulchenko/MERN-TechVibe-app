import { OrderItem } from "./order-item.interface";
import { ProductInterface } from "./product.interface";
import { OrderInterface } from "./order.interface";

export interface CartInterface extends ProductInterface, OrderInterface {
  cartItems: OrderItem[];
}

// TODO
//[
// {
//     "_id": "6598521786d93708a8525fa6",
//     "user": "67464b505dd30ccbce686c57",
//     "name": "Airpods Wireless Bluetooth Headphones",
//     "image": "/images/airpods.jpg",
//     "brand": "Apple",
//     "category": "Electronics",
//     "description": "Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
//     "rating": 4.5,
//     "numReviews": 12,
//     "price": 89.99,
//     "countInStock": 10,
//     "reviews": [],
//     "__v": 0,
//     "createdAt": "2024-01-05T19:01:43.299Z",
//     "updatedAt": "2024-05-05T00:31:03.869Z",
//     "qty": 1
// },
// ]
