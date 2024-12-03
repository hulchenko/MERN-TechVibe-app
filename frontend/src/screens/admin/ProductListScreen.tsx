import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Link as NextUILink } from "@nextui-org/react";

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
  const { data = { products: [], pages: 0, page: 0 }, isLoading, error, refetch } = useGetProductsQuery({ pageNum });
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
      <div>
        <h1>Products</h1>
        <div>
          <Button onClick={() => navigate("/admin/product/create")}>
            <FaEdit /> Create Product
          </Button>
        </div>
      </div>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Genre</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No products found."}>
              {(data &&
                data.products?.map((product: ProductInterface) => (
                  <TableRow key={product._id}>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.genre}</TableCell>
                    <TableCell style={{ display: "flex", justifyContent: "center" }}>
                      <NextUILink as={Link} to={`/admin/product/${product._id}/edit`}>
                        <Button className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </NextUILink>
                      <Button color={"danger"} onClick={() => productDeleteHandler(product._id || "")}>
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))) ||
                []}
            </TableBody>
          </Table>
          <Paginate pages={data?.pages} currPage={data?.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
