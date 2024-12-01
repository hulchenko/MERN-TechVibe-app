import { Button, Col, Nav, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Paginate from "../../components/Paginate";
import { ProductInterface } from "../../interfaces/product.interface";
import { useDeleteProductMutation, useGetProductsQuery } from "../../slices/productsApiSlice";
import { apiErrorHandler } from "../../utils/errorUtils";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const { pageNum = "0" } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNum });
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

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={() => navigate("/admin/product/create")}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
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
                <th>Name</th>
                <th>Price</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((product: ProductInterface) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.genre}</td>
                  <td style={{ display: "flex", justifyContent: "center" }}>
                    <Nav.Link as={Link} to={`/admin/product/${product._id}/edit`}>
                      <Button className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Nav.Link>
                    <Button variant="danger" className="btn-sm" onClick={() => productDeleteHandler(product._id || "")}>
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data?.pages} currPage={data?.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
