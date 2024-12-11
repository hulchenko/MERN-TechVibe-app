import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { APIError } from "../types/api-error.type";

const MyOrderListScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNum = searchParams.get("page") || "1";
  const { data, isLoading, error } = useGetMyOrdersQuery({ pageNum });

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <>
      <h1 className="text-lg font-bold py-4">My Orders</h1>
      <Table className="mb-2">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Paid</TableColumn>
          <TableColumn>Delivered</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No orders found."}>
          {data?.orders?.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.createdAt?.substring(0, 10)}</TableCell>
              <TableCell>${order.totalPrice}</TableCell>
              <TableCell className="text-success">{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes className="text-warning" />}</TableCell>
              <TableCell className="text-success">{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes className="text-warning" />}</TableCell>
              <TableCell>
                <Button color="primary" variant="faded" onClick={() => navigate(`/order/${order._id}`)}>
                  Details
                </Button>
              </TableCell>
            </TableRow>
          )) || []}
        </TableBody>
      </Table>
      <Paginate pages={data?.pages} currPage={data?.page} />
    </>
  );
};

export default MyOrderListScreen;
