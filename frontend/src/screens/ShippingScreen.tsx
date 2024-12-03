import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { useAppDispatch, useAppSelector } from "../hooks";
import { saveShippingAddress } from "../slices/cartSlice";
import { Card, Input, Button } from "@nextui-org/react";

const ShippingScreen = () => {
  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps dashboardStep shippingStep />
      <Card>
        <h1>Shipping Details</h1>
        <form onSubmit={submitHandler}>
          <Input
            type="text"
            label="Address"
            labelPlacement={"outside"}
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input type="text" label="City" labelPlacement={"outside"} placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input
            type="text"
            label="Postal Code"
            labelPlacement={"outside"}
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <Input
            type="text"
            label="Country"
            labelPlacement={"outside"}
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Button type="submit" color="primary">
            Continue
          </Button>
        </form>
      </Card>
    </>
  );
};

export default ShippingScreen;
