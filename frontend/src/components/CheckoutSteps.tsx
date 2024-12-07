import { Breadcrumbs, BreadcrumbItem, Link as NextUILink } from "@nextui-org/react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ cartStep = false, shippingStep = false, paymentStep = false, orderStep = false }) => {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>
        <NextUILink as={Link} to="/cart" isDisabled={!cartStep}>
          Cart
        </NextUILink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <NextUILink as={Link} to="/shipping" isDisabled={!shippingStep}>
          Shipping
        </NextUILink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <NextUILink as={Link} to="/payment" isDisabled={!paymentStep}>
          Payment
        </NextUILink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <NextUILink as={Link} to="/place-order" isDisabled={!orderStep}>
          Place Order
        </NextUILink>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default CheckoutSteps;
