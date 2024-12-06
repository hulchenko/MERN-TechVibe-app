import { Breadcrumbs, BreadcrumbItem, Link as NextUILink } from "@nextui-org/react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ cartStep = false, shippingStep = false, paymentStep = false, orderStep = false }) => {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        {cartStep ? (
          <NextUILink as={Link} to="/cart">
            Cart
          </NextUILink>
        ) : (
          <NextUILink isDisabled>Cart</NextUILink>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem>
        {shippingStep ? (
          <NextUILink as={Link} to="/shipping">
            Shipping
          </NextUILink>
        ) : (
          <NextUILink isDisabled>Shipping</NextUILink>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem>
        {paymentStep ? (
          <NextUILink as={Link} to="/payment">
            Payment
          </NextUILink>
        ) : (
          <NextUILink isDisabled>Payment</NextUILink>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem>
        {orderStep ? (
          <NextUILink as={Link} to="/placeorder">
            Place Order
          </NextUILink>
        ) : (
          <NextUILink isDisabled>Place Order</NextUILink>
        )}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default CheckoutSteps;
