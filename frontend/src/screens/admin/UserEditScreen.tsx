import { Button, Divider, Form, Input, Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { UserEditValidators, UserInterface } from "../../interfaces/user.interface";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../slices/usersApiSlice";
import { APIError } from "../../types/api-error.type";
import { apiErrorHandler } from "../../utils/errorUtils";
import { validateEmail, validateName } from "../../utils/genericUtils";

const UserEditScreen = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [validators, setValidators] = useState<UserEditValidators>({ name: true, email: true });
  const [user, setUser] = useState<UserInterface>({
    userId,
    name: "",
    email: "",
    isAdmin: false,
  });

  const { data: initUser, isLoading, refetch, error } = useGetUserDetailsQuery(userId || "");
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (initUser) {
      const { name, email, isAdmin } = initUser;
      setUser({
        ...user,
        name,
        email,
        isAdmin: isAdmin || false,
      });
    }
  }, [initUser]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, isAdmin } = user;
    const formValidators: UserEditValidators = {
      name: validateName(name),
      email: validateEmail(email),
    };

    setValidators(formValidators);
    const isInvalid = Object.values(formValidators).includes(false);
    if (isInvalid) return;

    try {
      await updateUser(user);
      toast.success("User updated");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <>
      <div className="flex justify-center items-center mt-12 h-6 gap-2">
        <Button color="primary" variant="bordered" onClick={() => navigate("/admin/userlist")}>
          Users
        </Button>
        <Divider orientation="vertical" />
        <h1 className="text-lg font-bold">Edit User</h1>
      </div>

      <div className="w-full flex justify-center mt-12">
        <Form onSubmit={submitHandler} className="w-full max-w-56 flex flex-col gap-4 mt-4">
          <Input
            color="primary"
            variant="bordered"
            type="text"
            label="Name"
            labelPlacement={"outside"}
            placeholder="Enter name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            isInvalid={!validators.name}
            errorMessage={user.name.length === 0 ? "Name field cannot be empty" : "Please double check the input"}
          />
          <Input
            color="primary"
            variant="bordered"
            type="email"
            label="Email"
            labelPlacement={"outside"}
            placeholder="Enter email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            isInvalid={!validators.email}
            errorMessage={user.email.length === 0 ? "Email field cannot be empty" : "Please double check the input"}
          />
          <Switch color="primary" size="sm" isSelected={user.isAdmin} onValueChange={(key) => setUser({ ...user, isAdmin: key })}>
            Admin
          </Switch>
          <Button isLoading={loadingUpdate} type="submit" color="primary" variant="solid">
            Update
          </Button>
        </Form>
      </div>
    </>
  );
};

export default UserEditScreen;
