import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { ProductInterface } from "../interfaces/product.interface";
import { APIError } from "../types/api-error.type";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/react";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { pageNum = "0", keyword = "" } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNum });

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <div className="w-full text-center pt-96">
          <h2>Nothing found.</h2>
          <Button onClick={() => navigate("/")} color="primary" variant="solid" className="mt-8">
            Home
          </Button>
        </div>
      )}
      <div className="grid grid-flow-row grid-cols-5 gap-4 py-4">
        {data?.products?.map((product: ProductInterface) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
      <Paginate pages={data?.pages} currPage={data?.page} keyword={keyword} />
    </>
  );
};

export default HomeScreen;
