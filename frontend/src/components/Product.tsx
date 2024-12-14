import { Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "../interfaces/product.interface";
import Rating from "./Rating";

const Product = ({ product }: { product: ProductInterface }) => {
  const navigate = useNavigate();

  return (
    <Card className="rounded" isPressable onPress={() => navigate(`/product/${product._id}`)}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col">
        <b className="font-bold text-md sm:text-large items-center w-full sm:max-w-60 overflow-hidden text-nowrap 2xl:overflow-auto 2xl:text-wrap text-ellipsis">
          {product.name}
        </b>
        <div className="flex-col 2xl:flex 2xl:flex-row 2xl:justify-between w-full px-6 items-center">
          <small>
            <Rating value={product.rating || 0} text={`${product.numReviews} review(s)`}></Rating>
          </small>
          <p className="font-bold">${product.price}</p>
        </div>
      </CardHeader>
      <CardBody className="items-center justify-center overflow-hidden">
        <Image
          loading="lazy"
          src={product.image}
          fallbackSrc={"/images/no-image.jpg"}
          alt={product.name}
          className="object-cover rounded-xl max-h-full 2xl:max-h-48"
          radius="sm"
          height={220}
          width={140}
        />
      </CardBody>
    </Card>
  );
};

export default Product;
