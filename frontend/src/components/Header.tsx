import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
} from "@nextui-org/react";

import { CartIcon } from "../icons/CartIcon";

import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCredentials } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import SearchBox from "./SearchBox";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.auth);
  const totalCartItems = cartItems.reduce((acc, curr) => acc + curr.qty, 0) || 0;
  const isHomePage = location.pathname === "/";

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
    <Navbar>
      <NavbarBrand as={Link} to="/" className="text-lg font-bold gap-2">
        <FontAwesomeIcon icon={faBook} className="text-violet-500" /> BookStore
      </NavbarBrand>
      <NavbarContent justify="center">
        {isHomePage && <SearchBox />}
        <NavbarItem>
          <NextUILink as={Link} to="/cart">
            <Badge color="primary" content={totalCartItems} isInvisible={totalCartItems === 0} shape="circle">
              <CartIcon className="text-violet-500" />
            </Badge>
          </NextUILink>
        </NavbarItem>
        {userInfo ? (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="faded" color="primary">
                {userInfo.name}
              </Button>
            </DropdownTrigger>

            {userInfo.isAdmin ? (
              // Additional admin actions
              <DropdownMenu>
                <DropdownItem onClick={() => navigate("/admin/orderlist")}>Orders</DropdownItem>
                <DropdownItem onClick={() => navigate("/admin/userlist")}>Users</DropdownItem>
                <DropdownItem onClick={() => navigate("/admin/productlist")}>Products</DropdownItem>
                <DropdownItem onClick={() => navigate("/profile")}>Profile</DropdownItem>
                <DropdownItem onClick={logoutHandler} className="text-warning" color="warning">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownItem onClick={() => navigate("/profile")}>Profile</DropdownItem>
                <DropdownItem onClick={logoutHandler} className="text-warning" color="warning">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        ) : (
          <Button variant="ghost" color="primary" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
