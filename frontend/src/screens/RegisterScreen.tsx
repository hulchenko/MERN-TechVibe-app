import { Button, Divider, Form, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Greeting from "../components/Greeting";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { UserValidators } from "../interfaces/user.interface";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { apiErrorHandler } from "../utils/errorUtils";
import { validateEmailPassword, validateName } from "../utils/genericUtils";

const RegisterScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerApiCall, { isLoading }] = useRegisterMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const [validators, setValidators] = useState<UserValidators>({ name: true, email: true, password: true, passwordMatch: true });

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRegex = validateName(name);
    const { emailRegex, passwordRegex } = validateEmailPassword(email, password);

    const formValidators: UserValidators = {
      name: nameRegex,
      email: emailRegex,
      password: passwordRegex,
      passwordMatch: password === confirmPassword,
    };

    setValidators(formValidators);
    const isInvalid = Object.values(formValidators).includes(false);
    if (isInvalid) return;

    try {
      const res = await registerApiCall({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  return (
    <div className="w-full flex justify-center mt-12">
      <div>
        <Greeting />
        <div className="w-full flex flex-col items-center mt-12">
          <Form onSubmit={submitHandler}>
            <div className="flex flex-col gap-2 w-56">
              <Input
                color="primary"
                variant="bordered"
                type="text"
                label="Name"
                labelPlacement={"outside"}
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!validators.name}
                errorMessage={name.length === 0 ? "Name field cannot be empty" : "Please double check the input"}
              />
              <Input
                color="primary"
                variant="bordered"
                type="email"
                label="Email"
                labelPlacement={"outside"}
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
                labelPlacement={"outside"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!validators.password || !validators.passwordMatch}
                errorMessage={
                  !validators.passwordMatch
                    ? "Passwords do not match"
                    : "At least 8 characters with 1 upper case, 1 lower case and 1 number. Can contain special characters."
                }
              />
              <Input
                color="primary"
                variant="bordered"
                type="password"
                label="Confirm Password"
                labelPlacement={"outside"}
                placeholder="Enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!validators.password || !validators.passwordMatch}
                errorMessage={
                  !validators.passwordMatch
                    ? "Passwords do not match"
                    : "At least 8 characters with 1 upper case, 1 lower case and 1 number. Can contain special characters."
                }
              />
              <Button type="submit" color="primary" variant="shadow" isDisabled={isLoading}>
                Register
              </Button>
              {isLoading && <Loader />}
            </div>
          </Form>
          <Divider className="my-2 w-56" />
          <p className="w-full flex justify-center gap-4">
            Have an account?{" "}
            <Link className="text-violet-500 underline" to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
