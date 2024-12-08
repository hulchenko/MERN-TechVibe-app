import { Button } from "@nextui-org/button";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";
import { ProductInterface } from "../interfaces/product.interface";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { APIError } from "../types/api-error.type";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { pageNum = "1", keyword = "" } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNum });

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <>
      {!keyword && <ProductCarousel />}
      {keyword && data?.products.length === 0 && (
        <div className="w-full text-center pt-96">
          <h2>Nothing found.</h2>
          <Button onClick={() => navigate("/")} color="primary" variant="solid" className="mt-8">
            Home
          </Button>
        </div>
      )}
      {data && data.products.length > 0 && (
        <>
          <div className="grid grid-flow-row grid-cols-5 gap-4 py-4">
            {data.products.map((product: ProductInterface) => (
              <Product product={product} key={product._id} />
            ))}
          </div>
          <Paginate pages={data?.pages} currPage={data?.page} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
