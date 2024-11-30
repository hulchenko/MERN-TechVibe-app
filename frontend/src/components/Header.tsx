import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCredentials } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import SearchBox from "./SearchBox";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cartItems } = useAppSelector((state) => state.cart); //this will access store reducer.cart in the store.js file
  const { userInfo } = useAppSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(clearCredentials());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.error(`Error occured: ${error}`);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            BookStore
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <SearchBox />
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="warning" style={{ marginLeft: "5px" }}>
                    {cartItems.reduce((acc, curr) => acc + curr.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  {userInfo.isAdmin && (
                    // Additional admin actions
                    <>
                      <NavDropdown.Item as={Link} to="/admin/orderlist">
                        Orders
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/userlist">
                        Users
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/productlist">
                        Products
                      </NavDropdown.Item>
                      <hr style={{ margin: "0.25rem" }} />
                    </>
                  )}
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>Log Out</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <FaUser /> Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
