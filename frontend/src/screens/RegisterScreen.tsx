import { useEffect, useState } from "react";
import { Button, Card, Divider, Input } from "@nextui-org/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { APIError } from "../types/api-error.type";

const RegisterScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerApiCall, { isLoading }] = useRegisterMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const res = await registerApiCall({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (error) {
        // Narrow down the type of error
        if ((error as APIError)?.data) {
          // Handle API error with data
          toast.error((error as APIError)?.data.message || "An API error occurred");
        } else if (error instanceof Error) {
          // Handle JavaScript Error
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col gap-2 w-56">
          <Input type="text" label="Name" labelPlacement={"outside"} placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" label="Email" labelPlacement={"outside"} placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            label="Password"
            labelPlacement={"outside"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <Input
            type="password"
            label="Confirm Password"
            labelPlacement={"outside"}
            placeholder="Enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" color="primary" variant="shadow" isDisabled={isLoading}>
          Register
        </Button>
        {isLoading && <Loader />}
      </form>
      <Divider />
      <p>
        Already have an account?{" "}
        <Link className="text-violet-500" to={redirect ? `/login?redirect=${redirect}` : "/login"}>
          Sign In
        </Link>
      </p>
    </>
  );
};

export default RegisterScreen;
