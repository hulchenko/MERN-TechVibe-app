import { Button, Radio, RadioGroup } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { useAppDispatch, useAppSelector } from "../hooks";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <CheckoutSteps dashboardStep shippingStep paymentStep />
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <RadioGroup label="Select Method" defaultValue="paypal">
          <Radio value="paypal" onChange={(e) => setPaymentMethod(e.target.value)}>
            PayPal or Credit Card
          </Radio>
        </RadioGroup>
        <Button type="submit" color="primary">
          Continue
        </Button>
      </form>
    </>
  );
};

export default PaymentScreen;
