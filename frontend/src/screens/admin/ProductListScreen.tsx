import { Button } from "@nextui-org/button";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";

import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ModalBox from "../../components/ModalBox";
import Paginate from "../../components/Paginate";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ProductInterface } from "../../interfaces/product.interface";
import { openModal } from "../../slices/modalSlice";
import { useDeleteProductMutation, useGetProductsQuery } from "../../slices/productsApiSlice";
import { apiErrorHandler } from "../../utils/errorUtils";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const pageNum = searchParams.get("page") || "1";

  const { type, id, confirm } = useAppSelector((state) => state.modal);
  const { data = { products: [], pages: 0, page: 0 }, isLoading, error, refetch } = useGetProductsQuery({ pageNum });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  useEffect(() => {
    // Listen to modal slice action
    if (confirm && id) {
      productDeleteHandler(id);
    }
  }, [confirm, id]);

  const productDeleteHandler = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
      refetch();
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={error} />;

  return (
    <>
      <ModalBox />
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-bold py-4">Products</h1>
        <div>
          <Button color="primary" variant="faded" onClick={() => navigate("/admin/product/create")} className="mt-2">
            <FaEdit /> Create Product
          </Button>
        </div>
      </div>
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
                  <Button color="primary" variant="faded" onClick={() => navigate(`/product/${product._id}`)}>
                    Details
                  </Button>
                  <Button color="primary" variant="faded" onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                    Edit
                  </Button>
                  <Button color="danger" variant="bordered" isLoading={loadingDelete} onClick={() => dispatch(openModal({ type: "product", id: product._id }))}>
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            )) || []}
          </TableBody>
        </Table>
        <Paginate pages={data?.pages} currPage={data?.page} />
      </>
    </>
  );
};

export default ProductListScreen;
