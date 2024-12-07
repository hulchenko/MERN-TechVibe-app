import { Button, Form, Radio, RadioGroup } from "@nextui-org/react";
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
    navigate("/place-order");
  };

  return (
    <div className="w-full flex justify-center mt-12">
      <div>
        <CheckoutSteps cartStep shippingStep paymentStep />
        <Form onSubmit={submitHandler} className="gap-4 mt-4">
          <RadioGroup label="Select Method" defaultValue="paypal">
            <Radio value="paypal" onChange={(e) => setPaymentMethod(e.target.value)}>
              PayPal
            </Radio>
            <Radio value="credit" isDisabled>
              Credit Card
            </Radio>
          </RadioGroup>
          <Button type="submit" color="primary" variant="bordered">
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PaymentScreen;
