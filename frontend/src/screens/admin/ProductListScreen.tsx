import { Button } from "@nextui-org/button";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";

import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Paginate from "../../components/Paginate";
import { ProductInterface } from "../../interfaces/product.interface";
import { useDeleteProductMutation, useGetProductsQuery } from "../../slices/productsApiSlice";
import { apiErrorHandler } from "../../utils/errorUtils";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNum = searchParams.get("page") || "1";
  const { data = { products: [], pages: 0, page: 0 }, isLoading, error, refetch } = useGetProductsQuery({ pageNum });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const productDeleteHandler = async (productId: string) => {
    // TODO use modals
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
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-bold py-4">Products</h1>
        <div>
          <Button color="primary" variant="faded" onClick={() => navigate("/admin/product/create")} className="mt-2">
            <FaEdit /> Create Product
          </Button>
        </div>
      </div>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message color="danger" title="Error" description={error} />
      ) : (
        <>
          <Table className="mb-2">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Genre</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No products found."}>
              {data?.products?.map((product: ProductInterface) => (
                <TableRow key={product._id}>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.genre}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button color="primary" variant="faded" onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                      <FaEdit />
                    </Button>
                    <Button color="danger" variant="bordered" onClick={() => productDeleteHandler(product._id || "")}>
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              )) || []}
            </TableBody>
          </Table>
          <Paginate pages={data?.pages} currPage={data?.page} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
