import { useEffect, useState } from "react";
import { Button, Input, Card, Switch } from "@nextui-org/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../slices/usersApiSlice";
import { APIError } from "../../types/api-error.type";
import { apiErrorHandler } from "../../utils/errorUtils";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId || "");
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin || false);
    }
  }, [user]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => navigate("/admin/userlist")}>
        Go Back
      </Button>
      <Card>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{(error as APIError)?.data?.message}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <Input type="text" label="Name" labelPlacement={"outside"} placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" label="Email" labelPlacement={"outside"} placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Switch isSelected={isAdmin} onValueChange={(key) => setIsAdmin(key)} />
            <Button type="submit" color="primary">
              Update
            </Button>
          </form>
        )}
      </Card>
    </>
  );
};

export default UserEditScreen;
