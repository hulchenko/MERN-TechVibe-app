import { Button, Card, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { useProfileMutation } from "../slices/usersApiSlice";
import { APIError } from "../types/api-error.type";
import { apiErrorHandler } from "../utils/errorUtils";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { pageNum = "1" } = useParams();

  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data, isLoading, error } = useGetMyOrdersQuery({ pageNum });

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (error) {
        apiErrorHandler(error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <div className="flex">
      <Card>
        <h2>User Profile</h2>
        <form onSubmit={submitHandler}>
          <Input
            color="primary"
            variant="bordered"
            type="text"
            label="Name"
            labelPlacement={"outside"}
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Input
            color="primary"
            variant="bordered"
            type="password"
            label="Confirm password"
            labelPlacement={"outside"}
            placeholder="Enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" color="primary" variant="solid" className="my-2">
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </form>
      </Card>
      <Card>
        <h2> My Orders</h2>
        <Table>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Total</TableColumn>
            <TableColumn>Paid</TableColumn>
            <TableColumn>Delivered</TableColumn>
            <TableColumn>{""}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No orders found."}>
            {data?.orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.createdAt?.substring(0, 10)}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes style={{ color: "red" }} />}</TableCell>
                <TableCell>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes style={{ color: "red" }} />}</TableCell>
                <TableCell>
                  <Button color="primary" variant="faded" onClick={() => navigate(`/order/${order._id}`)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            )) || []}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ProfileScreen;
