import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useAppDispatch, useAppSelector } from "../hooks";
import { OrderItemInterface } from "../interfaces/order-item.interface";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const addToCartHandler = (item: OrderItemInterface, qty: any) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Cart Is Empty. <Link to={"/"}>Go Back.</Link>
          </Message>
        ) : (
          <>
            {cartItems.map((item) => (
              <Card key={item._id}>
                <CardHeader>
                  <Image src={item.image} alt={item.name} height={300} radius="sm" width={300}></Image>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                  <p>${item.price}</p>
                </CardBody>
                <Divider />
                <Dropdown as="select">
                  <DropdownTrigger>
                    <Button variant="bordered">{item.qty}</Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={(key) => addToCartHandler(item, key)}>
                    {Array(item.countInStock)
                      .fill(0)
                      .map((_, idx) => (
                        <DropdownItem key={idx + 1} value={idx + 1}>
                          {idx + 1}
                        </DropdownItem>
                      ))}
                  </DropdownMenu>
                </Dropdown>
                <CardFooter>
                  <Button type="button" variant="light" onClick={() => removeFromCartHandler(item._id || "")}>
                    <FaTrash></FaTrash>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>

      <Card>
        <CardBody>
          <div className="flex">
            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) Item(s)</h2>$
            {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
          </div>
          <div className="flex">
            <Button type="button" className="btn-block" disabled={cartItems.length === 0} onClick={checkoutHandler}>
              Proceed To Checkout
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default CartScreen;
