import { Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "../interfaces/product.interface";
import Rating from "./Rating";

const Product = ({ product }: { product: ProductInterface }) => {
  const navigate = useNavigate();

  return (
    <Card className="rounded" isPressable onPress={() => navigate(`/product/${product._id}`)}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col">
        <b className="font-bold text-large overflow-auto max-w-60 items-center">{product.name}</b>
        <div className="flex justify-between w-full px-6 items-center">
          <small>
            <Rating value={product.rating || 0} text={`${product.numReviews} reviews`}></Rating>
          </small>
          <p className="uppercase font-bold">${product.price}</p>
        </div>
      </CardHeader>
      <CardBody className="items-center justify-center">
        <Image src={product.image} alt="product image" className="object-cover rounded-xl max-h-56" height={220} width={140} />
      </CardBody>
    </Card>
  );
};

export default Product;
