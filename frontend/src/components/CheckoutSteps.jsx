import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ dashboardStep = false, shippingStep = false, paymentStep = false, orderStep = false }) => {
  return (
    <Nav>
      <Nav.Item>
        {dashboardStep ? (
          <Nav.Link as={Link} to="/login">
            Dashboard
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {shippingStep ? (
          <Nav.Link as={Link} to="/shipping">
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {paymentStep ? (
          <Nav.Link as={Link} to="/payment">
            Payment
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {orderStep ? (
          <Nav.Link as={Link} to="/placeorder">
            Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
