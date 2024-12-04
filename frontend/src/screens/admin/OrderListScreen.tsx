import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetAllOrdersQuery } from "../../slices/ordersApiSlice";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <>
      <h1>Orders</h1>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>User</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Paid</TableColumn>
          <TableColumn>Delivered</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody>
          {(orders &&
            orders.map((order) => (
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
            ))) ||
            []}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderListScreen;
