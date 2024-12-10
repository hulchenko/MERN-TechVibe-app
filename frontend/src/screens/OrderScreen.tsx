import { Button, Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import type { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useAppSelector } from "../hooks";
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from "../slices/ordersApiSlice";
import { APIError } from "../types/api-error.type";
import { apiErrorHandler } from "../utils/errorUtils";
import { dateUTCFormat } from "../utils/genericUtils";

const OrderScreen = () => {
  const navigate = useNavigate();
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
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;
  if (!order) return <p>Order not found</p>;

  return (
    <>
      <div className="flex justify-center items-center mt-12 h-6 gap-2">
        {userInfo.isAdmin && (
          <Button color="primary" variant="bordered" onClick={() => navigate("/admin/orderlist")}>
            Orders
          </Button>
        )}
        {userInfo && !userInfo.isAdmin && (
          <Button color="primary" variant="bordered" onClick={() => navigate("/")}>
            Home
          </Button>
        )}
        <Divider orientation="vertical" />
        <h1 className="text-lg font-bold">Order details</h1>
      </div>

      <div className="w-full flex justify-between">
        <div className="w-full">
          <div>
            <h2 className="my-6 font-bold text-xl">Shipping details</h2>
            <div className="flex items-center gap-4">
              <h2 className="my-2 font-bold w-16">Order ID</h2>
              <p>{order._id}</p>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="my-2 font-bold w-16">Name</h2>
              <p>{order?.user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="my-2 font-bold w-16">Email</h2>
              <p>{order?.user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="my-2 font-bold w-16">Address</h2>
              <p>{`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}</p>
            </div>
            <div>
              <h2 className="my-2 font-bold w-16">Status</h2>
              {!order.isPaid && <Message color="warning" title="Warning" description="Awaiting payment" />}
              {order.isPaid && !order.isDelivered && <Message color="default" title="Info" description="Not delivered" />}
              {order.isPaid && order.isDelivered && (
                <Message color="success" title="Success" description={`Delivered on ${dateUTCFormat(order.deliveredAt)}`} />
              )}
            </div>
          </div>
          <Divider className="mt-2" />
          <div>
            <h2 className="my-6 font-bold text-xl">Payment details</h2>
            <div className="flex items-center gap-4">
              <h2 className="my-2 font-bold w-16">Method</h2>
              <p>{order.paymentMethod}</p>
            </div>
            <div>
              <h2 className="my-2 font-bold w-16">Status</h2>
              {order.isPaid && <Message color="success" title="Success" description={`Paid on ${dateUTCFormat(order.paidAt)}`} />}
              {!order.isPaid && <Message color="warning" title="Warning" description="Not paid" />}
            </div>
          </div>
          <Divider className="mt-2" />
          <h2 className="my-6 font-bold text-xl">Order items</h2>
          <div className="h-[20rem] overflow-auto">
            {order?.orderItems?.length === 0 && <Message title="No orders to display." />}
            {order?.orderItems?.map((item, index) => (
              <Card key={index} className="w-full flex my-4">
                <CardBody>
                  <div className="w-full flex items-center justify-between gap-4">
                    <Image src={item.image} alt={item.name} height={100} radius="sm" width={60}></Image>
                    <Link to={`/product/${item.product}`} className="w-40 underline text-violet-500">
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

        <div className="w-full flex-col justify-items-center mt-6">
          <div className="w-1/2">
            <Card>
              <CardHeader>
                <h2 className="font-bold text-xl w-full text-center">Order Summary</h2>
              </CardHeader>
              <CardBody>
                <div className="flex justify-between">
                  <h2 className="font-bold text-md">Items</h2>
                  <p>${order.itemsPrice}</p>
                </div>
                <Divider className="my-4" />
                <div className="flex justify-between">
                  <h2 className="font-bold text-md">Shipping</h2>
                  <p>${order.shippingPrice}</p>
                </div>
                <Divider className="my-4" />{" "}
                <div className="flex justify-between">
                  <h2 className="font-bold text-md">Tax</h2>
                  <p>${order.taxPrice}</p>
                </div>
                <Divider className="my-4" />
                <div className="flex justify-between">
                  <h2 className="font-bold text-md">Total</h2>
                  <p>${order.totalPrice}</p>
                </div>
              </CardBody>
            </Card>

            <Divider className="my-2" />

            <div className="w-full">
              {!order.isPaid && (
                <>
                  {loadingPay || isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      style={{ color: "black", tagline: false, layout: "horizontal" }}
                      className="bg-violet-400 border border-violet-400 rounded"
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  )}
                </>
              )}
              {loadingDeliver && <Loader />}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <Button type="button" variant="solid" color="success" className="btn btn-block w-full" onClick={deliverOrderHandler}>
                  Mark As Delivered
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
