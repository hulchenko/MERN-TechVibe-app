import { useEffect } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Input } from "@nextui-org/react";
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

  const [createOrder, { isLoading: createLoading, error }] = useCreateOrderMutation();

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
    <div className="w-full mt-12">
      <div className="flex justify-center">
        <CheckoutSteps cartStep shippingStep paymentStep orderStep />
      </div>
      <div className="flex gap-4 justify-between h-96 mt-6">
        <div className="flex-col h-full w-full">
          <div>
            <h2 className="my-6 font-bold">Shipping To</h2>
            <p>{`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.postalCode}, ${cart.shippingAddress.country}`}</p>
          </div>
          <Divider className="mt-2" />
          <div>
            <h2 className="my-6 font-bold">Payment Method</h2>
            <p>{`${cart.paymentMethod}`}</p>
          </div>
          <Divider className="mt-2" />
          <div>
            <h2 className="my-6 font-bold">Order Items</h2>
            <div className="h-[44rem] overflow-auto">
              {cart.cartItems.length === 0 && <Message title="Your cart is empty" />}
              {cart.cartItems.map((item, index) => (
                <Card key={index} className="w-full flex my-4">
                  <CardBody>
                    <div className="w-full flex items-center justify-between gap-4">
                      <Image src={item.image} alt={item.name} height={150} radius="sm" width={100}></Image>
                      <Link className="w-40 underline text-violet-500" to={`/product/${item._id}`}>
                        {item.name}
                      </Link>
                      <p>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Card className="h-96 w-1/2">
            <CardHeader>
              <h2 className="font-bold text-xl w-full text-center">Order Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="flex justify-between">
                <h2 className="font-bold text-md">Items</h2>
                <p>${cart.itemsPrice}</p>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between">
                <h2 className="font-bold text-md">Shipping</h2>
                <p>${cart.shippingPrice}</p>
              </div>
              <Divider className="my-4" />{" "}
              <div className="flex justify-between">
                <h2 className="font-bold text-md">Tax</h2>
                <p>${cart.taxPrice}</p>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between">
                <h2 className="font-bold text-md">Total</h2>
                <p>${cart.totalPrice}</p>
              </div>
              {error && <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />}
            </CardBody>
            <CardFooter className="flex-col">
              <Button
                type="button"
                color="success"
                variant="solid"
                isLoading={createLoading}
                isDisabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
