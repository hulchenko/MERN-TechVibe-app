import { useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Image, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCartItems } from "../slices/cartSlice";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { APIError } from "../types/api-error.type";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping"); // if some fields are empty send user back
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error("Error placing order");
    }
  };

  return (
    <>
      <CheckoutSteps dashboardStep shippingStep paymentStep orderStep />
      <Card>
        <CardHeader>
          <h2>Shipping</h2>
          <Input
            isReadOnly
            label="Address"
            variant="bordered"
            defaultValue={`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.postalCode}, ${cart.shippingAddress.country}`}
            className="max-w-xs"
          />
          <h2>Payment Method</h2>
          <Input isReadOnly label="Method" variant="bordered" defaultValue={`${cart.paymentMethod}`} className="max-w-xs" />
          <h2>Order Items</h2>
          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <>
              {cart.cartItems.map((item, index) => (
                <Card key={index}>
                  <CardBody>
                    <Image src={item.image} alt={item.name}></Image>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <p>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </>
          )}
        </CardHeader>
        <CardBody>
          <h2>Order Summary</h2>
          <Input isReadOnly label="Items" variant="bordered" defaultValue={`$${cart.itemsPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Shipping" variant="bordered" defaultValue={`$${cart.shippingPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Tax" variant="bordered" defaultValue={`$${cart.taxPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Total" variant="bordered" defaultValue={`$${cart.totalPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Total" variant="bordered" defaultValue={`$${cart.totalPrice}`} className="max-w-xs" />
          {error && <Message variant="danger">{(error as APIError)?.data?.message}</Message>}
          <Button type="button" isDisabled={cart.cartItems.length === 0} onClick={placeOrderHandler}>
            Place Order
          </Button>
          {isLoading && <Loader />}
        </CardBody>
      </Card>
    </>
  );
};

export default PlaceOrderScreen;
