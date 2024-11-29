import { Col, Row } from "react-bootstrap";
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
  const { pageNum, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNum });

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{(error as APIError)?.data?.message}</Message>;

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      <Row>
        {data.products.map((product: ProductInterface) => (
          <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginate pages={data.pages} currPage={data.page} keyword={keyword} />
    </>
  );
};

export default HomeScreen;
