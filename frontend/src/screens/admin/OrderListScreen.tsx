import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetAllOrdersQuery } from "../../slices/ordersApiSlice";
import Paginate from "../../components/Paginate";

const OrderListScreen = () => {
  const { pageNum = "1" } = useParams();
  const { data, isLoading, error } = useGetAllOrdersQuery({ pageNum });
  const navigate = useNavigate();
  console.log(`ORDERS: `, data?.orders);

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={error} />;

  return (
    <>
      <h1 className="text-lg font-bold py-4">Orders</h1>
      <Table className="mb-2">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>User</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Paid</TableColumn>
          <TableColumn>Delivered</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No orders found."}>
          {data?.orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.user && order.user.name}</TableCell>
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
      <Paginate pages={data?.pages} currPage={data?.page} isAdmin={true} />
    </>
  );
};

export default OrderListScreen;
