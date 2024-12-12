import { Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "../interfaces/product.interface";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { APIError } from "../types/api-error.type";
import Loader from "./Loader";
import Message from "./Message";

// Embla API
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

const ProductCarousel = () => {
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [Autoplay()]);
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {products?.map((product: ProductInterface) => (
            <div className="embla__slide" key={product._id}>
              <Image
                fallbackSrc={"/images/no-image.png"}
                src={product.image}
                alt={product.name}
                onClick={() => navigate(`/product/${product._id}`)}
                className="embla__slide__number"
                height={320}
                width={250}
              />
              <div className="font-bold">
                <h2 className="w-52 text-center text-wrap">{product.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
