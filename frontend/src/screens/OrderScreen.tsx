import type { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { Button, Image, Card, CardBody, CardHeader, Input, CardFooter } from "@nextui-org/react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useAppSelector } from "../hooks";
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from "../slices/ordersApiSlice";
import { APIError } from "../types/api-error.type";
import { apiErrorHandler } from "../utils/errorUtils";

const OrderScreen = () => {
  const { id: orderId = "" } = useParams();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  // PayPal init
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        const { clientId } = paypal;
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId, // key used to be "client-id"
            currency: "CAD",
          },
        });
      };
      paypalDispatch({
        type: "setLoadingStatus",
        value: SCRIPT_LOADING_STATE.PENDING,
      });

      if (order && !order.isPaid && !window.paypal) {
        // check if paypal script is not loaded on not paid order
        loadPaypalScript();
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    // https://github.com/paypal/react-paypal-js/blob/44a01f5532ca4274e5e4041e68a2ff3a95bb0f3b/src/stories/subscriptions/Subscriptions.stories.tsx#L30
    if (!actions.order) {
      return;
    }

    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order paid");
      } catch (error) {
        apiErrorHandler(error);
      }
    });
  };

  const onError = (error: Record<string, unknown>) => {
    toast.error(`Order not paid: ${(error as APIError)?.data.message || error.message}`);
  };

  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions) => {
    if (!actions.order || !order) {
      return Promise.reject("Order is not defined");
    }

    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderID: string) => orderID);
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{(error as APIError)?.data?.message}</Message>;
  if (!order) return <p>Order not found</p>;

  return (
    <>
      <h1>Order: {order._id}</h1>
      <Card>
        <CardHeader>
          <div>
            <h2>Shipping</h2>
            <Input isReadOnly label="Name" variant="bordered" defaultValue={order?.user?.name} className="max-w-xs" />
            <Input isReadOnly label="Email" variant="bordered" defaultValue={order?.user?.email} className="max-w-xs" />
            <Input
              isReadOnly
              label="Address"
              variant="bordered"
              defaultValue={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
              className="max-w-xs"
            />
            {order.isDelivered ? <Message variant="success">Delivered on {order.deliveredAt}</Message> : <Message variant="danger">Not delivered</Message>}
          </div>
          <div>
            <h2>Payment Method</h2>
            <Input isReadOnly label="Method" variant="bordered" defaultValue={order.paymentMethod} className="max-w-xs" />
            {order.isPaid ? <Message variant="success">Paid on {order.paidAt}</Message> : <Message variant="danger">Not paid</Message>}
          </div>
        </CardHeader>
        <CardBody>
          <h2>Order Items</h2>
          {order.orderItems.map((item, index) => (
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
        </CardBody>
        <CardFooter>
          <Input isReadOnly label="Order Summary" variant="bordered" defaultValue={`${order.itemsPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Shipping" variant="bordered" defaultValue={`${order.shippingPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Tax" variant="bordered" defaultValue={`${order.taxPrice}`} className="max-w-xs" />
          <Input isReadOnly label="Total" variant="bordered" defaultValue={`${order.totalPrice}`} className="max-w-xs" />
          <div>
            {!order.isPaid && (
              <Card>
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                  </div>
                )}
              </Card>
            )}
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                Mark As Delivered
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default OrderScreen;
