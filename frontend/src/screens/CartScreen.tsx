import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { OrderItem } from "../interfaces/order-item.interface";
import { useGetProductsQuery, useGetTopProductsQuery } from "../slices/productsApiSlice";
import { useGetAllOrdersQuery } from "../slices/ordersApiSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.auth);
  const { data: products } = useGetTopProductsQuery(null);
  const { data: orders } = useGetAllOrdersQuery();

  console.log(`CART ITEMS: `, cartItems);
  console.log(`USER INFO: `, userInfo);
  console.log(`PRODUCTS: `, products);
  console.log(`ORDERS: `, orders);

  const addToCartHandler = (item: OrderItem, qty: number) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Cart Is Empty. <Link to={"/"}>Go Back.</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded></Image>
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control as="select" value={item.qty} onChange={(e) => addToCartHandler(item, Number(e.target.value))}>
                      {Array(item.countInStock)
                        .fill(0)
                        .map((_, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            {idx + 1}
                          </option>
                        ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type="button" variant="light" onClick={() => removeFromCartHandler(item._id || "")}>
                      <FaTrash></FaTrash>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) Item(s)</h2>$
              {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button type="button" className="btn-block" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
