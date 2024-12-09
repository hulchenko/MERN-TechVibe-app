import { Button, Form, Input } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ShippingFormValidators } from "../interfaces/shipping.interface";
import { saveShippingAddress } from "../slices/cartSlice";
import countries from "./../assets/data/countries.json";

const ShippingScreen = () => {
  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [validators, setValidators] = useState<ShippingFormValidators>({ address: true, city: true, postalCode: true, country: true });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    // validate form
    const addressRegex = /^[a-zA-Z0-9\s,'-]+$/g;
    const cityRegex = /^([A-Z][a-z]+)+$/g;
    const postalUSRegex = /^\d{5}(?:[-\s]\d{4})?$/;
    const postalCARegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

    const formValidators: ShippingFormValidators = {
      address: addressRegex.test(address),
      city: cityRegex.test(city),
      postalCode: postalUSRegex.test(postalCode) || postalCARegex.test(postalCode),
      country: countries.includes(country),
    };

    setValidators(formValidators);
    const isInvalid = Object.values(formValidators).includes(false);
    if (isInvalid) return;

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <div className="w-full flex justify-center mt-12">
      <div>
        <CheckoutSteps cartStep shippingStep />
        <Form onSubmit={submitHandler} className="w-full max-w-xs flex flex-col gap-4 mt-4">
          <Input
            color="primary"
            variant="bordered"
            isRequired
            type="text"
            label="Address"
            labelPlacement={"outside"}
            placeholder="Enter address"
            isInvalid={!validators.address}
            errorMessage="Please enter a valid address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            color="primary"
            variant="bordered"
            isRequired
            type="text"
            label="City"
            labelPlacement={"outside"}
            placeholder="Enter city"
            isInvalid={!validators.city}
            errorMessage="Please enter a valid city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            color="primary"
            variant="bordered"
            isRequired
            type="text"
            label="Postal Code"
            labelPlacement={"outside"}
            placeholder="Enter postal code"
            isInvalid={!validators.postalCode}
            errorMessage="Please enter a valid postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <Input
            color="primary"
            variant="bordered"
            isRequired
            type="text"
            label="Country"
            labelPlacement={"outside"}
            placeholder="Enter country"
            isInvalid={!validators.country}
            errorMessage="Please enter a valid country name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Button type="submit" color="primary" variant="bordered">
            Continue
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ShippingScreen;
