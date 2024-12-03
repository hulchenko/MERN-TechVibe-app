import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { ProductInterface } from "../interfaces/product.interface";
import { APIError } from "../types/api-error.type";

const HomeScreen = () => {
  const { pageNum = "0", keyword = "" } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNum });

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{(error as APIError)?.data?.message}</Message>;

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Reset
        </Link>
      )}
      <h1>Latest Products</h1>
      <div className="grid grid-flow-row grid-cols-4 gap-4">
        {data?.products?.map((product: ProductInterface) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
      <Paginate pages={data?.pages} currPage={data?.page} keyword={keyword} />
    </>
  );
};

export default HomeScreen;
