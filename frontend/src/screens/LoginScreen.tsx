import { Button, Divider, Form, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Greeting from "../components/Greeting";
import { useAppDispatch, useAppSelector } from "../hooks";
import { UserAuthFormValidators } from "../interfaces/user.interface";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/usersApiSlice";
import { apiErrorHandler } from "../utils/errorUtils";
import { validateEmail, validatePassword } from "../utils/genericUtils";

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userInfo } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validators, setValidators] = useState<UserAuthFormValidators>({ email: true, password: true });

  const [loginApiCall, { isLoading }] = useLoginMutation();

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // redirect param persists till the user is logged in

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const formValidators: UserAuthFormValidators = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setValidators(formValidators);
    const isInvalid = Object.values(formValidators).includes(false);
    if (isInvalid) return;

    try {
      const res = await loginApiCall({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  return (
    <div className="w-full flex justify-center mt-44">
      <div>
        <Greeting />
        <div className="w-full flex flex-col items-center mt-12">
          <Form onSubmit={submitHandler}>
            <div className="flex flex-col gap-2 w-56">
              <Input
                color="primary"
                variant="bordered"
                type="email"
                label="Email"
                labelPlacement={"inside"}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!validators.email}
                errorMessage={email.length === 0 ? "Email field cannot be empty" : "Please double check the input"}
              />
              <Input
                color="primary"
                variant="bordered"
                type="password"
                label="Password"
                labelPlacement={"inside"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!validators.password}
                errorMessage={"At least 8 characters with 1 upper case, 1 lower case and 1 number. Can contain special characters."}
              />
              <Button type="submit" color="primary" variant="shadow" isLoading={isLoading} className="w-full">
                Sign In
              </Button>
            </div>
          </Form>
          <Divider className="my-2 w-56" />
          <p className="w-full flex justify-center gap-4">
            New Customer?{" "}
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-violet-500 underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
