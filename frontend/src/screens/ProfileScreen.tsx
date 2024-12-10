import { Button, Divider, Form, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { UserValidators } from "../interfaces/user.interface";
import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/usersApiSlice";
import { apiErrorHandler } from "../utils/errorUtils";
import { validateEmailPassword, validateName } from "../utils/genericUtils";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const [validators, setValidators] = useState<UserValidators>({ name: true, email: true, password: true, passwordMatch: true });

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

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
      const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  return (
    <>
      <div className="flex justify-around mt-12">
        <Button color="primary" variant="bordered" onClick={() => navigate("/")}>
          Back
        </Button>
        <div>
          <h1 className="text-lg font-bold">User Profile</h1>
          <Divider />
        </div>
        <span id="do-no-remove"></span>
      </div>
      <div className="w-full flex justify-center mt-12">
        <Form onSubmit={submitHandler} className="w-full max-w-56 flex flex-col gap-4 mt-4">
          <Input
            isRequired
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
            isRequired
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
            isRequired
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
            isRequired
            color="primary"
            variant="bordered"
            type="password"
            label="Confirm password"
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
          <Button type="submit" color="primary" variant="solid" className="my-2">
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </div>
    </>
  );
};

export default ProfileScreen;
