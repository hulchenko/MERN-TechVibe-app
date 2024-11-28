import { Review } from "./review.interface";
import { UserInterface } from "./user.interface";

export interface ProductInterface {
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  countInStock: number;
  qty: number;
  _id?: string;
  productId?: string;
  user?: UserInterface;
  reviews?: Review[];
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

// TODO
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
//     "updatedAt": "2024-05-05T00:31:03.869Z"
// }
