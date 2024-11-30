import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { APIError } from "../types/api-error.type";
import { ProductInterface } from "../interfaces/product.interface";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductCarousel = () => {
  const carouselCaption: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    left: "0",
    right: "0",
    bottom: "0",
    background: "rgba(0, 0, 0, 0.5)",
  };
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{(error as APIError)?.data?.message}</Message>;

  return (
    <>
      <h4 style={{ width: "100%", background: "goldenrod", color: "white", margin: "0", padding: "0.25rem", textAlign: "center", fontWeight: "lighter" }}>
        <FontAwesomeIcon size="2xs" icon={faStar} /> Our Bestsellers <FontAwesomeIcon size="2xs" icon={faStar} />
      </h4>
      <Carousel pause="hover" className="bg-primary mb-4">
        {products &&
          products.map((product: ProductInterface) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} fluid />
                <Carousel.Caption style={carouselCaption}>
                  <h2 className="text-white text-right">
                    {product.name} (${product.price})
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
      </Carousel>
    </>
  );
};

export default ProductCarousel;