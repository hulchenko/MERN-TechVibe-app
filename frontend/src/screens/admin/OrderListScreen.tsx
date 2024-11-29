import { Button, Nav, Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetAllOrdersQuery } from "../../slices/ordersApiSlice";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <>
      <h1>Orders</h1>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes style={{ color: "red" }} />}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes style={{ color: "red" }} />}</td>
                <td>
                  <Nav.Link as={Link} to={`/order/${order._id}`}>
                    <Button className="btn-sm">Details</Button>
                  </Nav.Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;
