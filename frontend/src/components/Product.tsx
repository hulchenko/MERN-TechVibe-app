import { Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "../interfaces/product.interface";
import Rating from "./Rating";

const Product = ({ product }: { product: ProductInterface }) => {
  const navigate = useNavigate();

  return (
    <Card className="my-3 p-3 rounded" isPressable onPress={() => navigate(`/product/${product._id}`)}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col">
        <b className="font-bold text-large overflow-auto max-w-60 items-center">{product.name}</b>
        <div className="flex justify-between w-full">
          <small>
            <Rating value={product.rating || 0} text={`${product.numReviews} reviews`}></Rating>
          </small>
          <p className="text-tiny uppercase font-bold">${product.price}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Image src={product.image} shadow="sm" radius="lg" width={300} alt="product image" className="object-cover rounded-xl" />
      </CardBody>
    </Card>
  );
};

export default Product;
