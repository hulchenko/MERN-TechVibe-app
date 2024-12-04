// import { Carousel, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ProductInterface } from "../interfaces/product.interface";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { APIError } from "../types/api-error.type";
import Loader from "./Loader";
import Message from "./Message";
import { Image } from "@nextui-org/react";

// Embla API
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ProductCarousel = () => {
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{(error as APIError)?.data?.message}</Message>;

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {products &&
          products.map((product: ProductInterface) => (
            <div className="embla__slide" key={product._id}>
              <Image src={product.image} alt={product.name} onClick={() => navigate(`/product/${product._id}`)} className="embla__slide__number" />
              <div className="text-gray-400 font-bold w-full whitespace-nowrap text-ellipsis overflow-hidden">
                <h2>{product.name}</h2>
                <h5>${product.price}</h5>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
