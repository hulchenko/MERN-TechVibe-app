import { Button, Card, Divider, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/usersApiSlice";
import { apiErrorHandler } from "../utils/errorUtils";

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginApiCall, { isLoading }] = useLoginMutation();

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
    try {
      const res = await loginApiCall({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  return (
    <Card>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col gap-2 w-56">
          <Input
            color="primary"
            variant="bordered"
            type="email"
            label="Email"
            labelPlacement={"outside"}
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            color="primary"
            variant="bordered"
            type="password"
            label="Password"
            labelPlacement={"outside"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" color="primary" variant="shadow" isDisabled={isLoading}>
          Sign In
        </Button>
        {isLoading && <Loader />}
      </form>

      <Divider />
      <p>
        New Customer?{" "}
        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-violet-500">
          Sign Up
        </Link>
      </p>
    </Card>
  );
};

export default LoginScreen;
