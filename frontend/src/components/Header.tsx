import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
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
import { apiSlice } from "../slices/apiSlice";
import { clearCredentials } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { reduceCartItems } from "../utils/cartUtils";
import SearchBox from "./SearchBox";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.auth);
  const totalCartItems = reduceCartItems(cartItems);
  const isHomePage = location.pathname === "/";

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(clearCredentials());
      dispatch(resetCart());
      dispatch(apiSlice.util.resetApiState()); // resets local state
      navigate("/login");
    } catch (error) {
      console.error(`Error occured: ${error}`);
    }
  };

  return (
    <Navbar maxWidth="2xl" isBordered={true}>
      <NavbarBrand as={Link} to="/" className="text-2xl font-bold gap-2">
        <FontAwesomeIcon icon={faBook} className="text-violet-500" /> BookStore
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>{isHomePage && <SearchBox />}</NavbarItem>
        <NavbarItem>
          <NextUILink as={Link} to="/cart" className="flex content-center">
            <Badge color="primary" content={totalCartItems} isInvisible={totalCartItems === 0} shape="circle">
              <CartIcon className="text-violet-500" />
            </Badge>
          </NextUILink>
        </NavbarItem>
        {userInfo ? (
          <Dropdown>
            <DropdownTrigger>
              <Avatar isBordered size="sm" color="success" showFallback name={userInfo.name} className="min-w-8 cursor-pointer" />
            </DropdownTrigger>
            <DropdownMenu>
              {userInfo.isAdmin && (
                // Additional admin actions
                <DropdownSection showDivider title="Admin Actions">
                  <DropdownItem onClick={() => navigate("/admin/orderlist")}>All Orders</DropdownItem>
                  <DropdownItem onClick={() => navigate("/admin/userlist")}>All Users</DropdownItem>
                  <DropdownItem onClick={() => navigate("/admin/productlist")}>All Products</DropdownItem>
                </DropdownSection>
              )}
              <DropdownSection>
                <DropdownItem onClick={() => navigate("/my-orders")}>My Orders</DropdownItem>
                <DropdownItem onClick={() => navigate("/profile")}>Profile</DropdownItem>
                <DropdownItem onClick={logoutHandler} className="text-warning" color="warning">
                  Log Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
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
