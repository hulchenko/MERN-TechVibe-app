import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Badge,
  Button,
  Divider,
} from "@nextui-org/react";

import { SearchIcon } from "../icons/SearchIcon";
import { CartIcon } from "../icons/CartIcon";

import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCredentials } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import SearchBox from "./SearchBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cartItems } = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.auth);
  const totalCartItems = cartItems.reduce((acc, curr) => acc + curr.qty, 0) || 0;

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
      <Navbar>
        <NavbarBrand as={Link} to="/">
          <FontAwesomeIcon icon={faBook} /> BookStore
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {/* <SearchIcon /> */}
          {/* TODO */}
          <SearchBox />
          <NavbarItem>
            <NextUILink as={Link} to="/cart">
              <Badge color="primary" content={totalCartItems} isInvisible={totalCartItems === 0} shape="circle">
                <CartIcon />
              </Badge>
            </NextUILink>
          </NavbarItem>
          {userInfo ? (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">{userInfo.name}</Button>
              </DropdownTrigger>

              {userInfo.isAdmin ? (
                // Additional admin actions
                <DropdownMenu>
                  <DropdownItem className={"display: none"} onClick={() => navigate("/admin/orderlist")}>
                    Orders
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate("/admin/userlist")}>Users</DropdownItem>
                  <DropdownItem onClick={() => navigate("/admin/productlist")}>Products</DropdownItem>
                  <DropdownItem onClick={() => navigate("/profile")}>Profile</DropdownItem>
                  <DropdownItem onClick={logoutHandler}>Log Out</DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownItem onClick={() => navigate("/profile")}>Profile</DropdownItem>
                  <DropdownItem onClick={logoutHandler}>Log Out</DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          ) : (
            <NextUILink as={Link} to="/login">
              <FaUser /> Sign In
            </NextUILink>
          )}
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;
