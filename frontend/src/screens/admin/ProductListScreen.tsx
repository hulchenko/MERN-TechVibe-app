import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "../../slices/productsApiSlice";
import Paginate from "../../components/Paginate";
import { apiErrorHandler } from "../../utils/errorUtils";
import { ProductInterface } from "../../interfaces/product.interface";

const ProductListScreen = () => {
  const { pageNum } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNum });
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const productDeleteHandler = async (productId: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted");
        refetch();
      } catch (error) {
        apiErrorHandler(error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Create a new product?")) {
      try {
        await createProduct(null);
        refetch();
      } catch (error) {
        apiErrorHandler(error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={() => createProductHandler()}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product: ProductInterface) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => productDeleteHandler(product._id || "")}>
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} currPage={data.page} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
