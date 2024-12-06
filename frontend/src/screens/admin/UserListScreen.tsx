import { Button, Table, TableHeader, TableColumn, TableBody, TableCell, TableRow, Card } from "@nextui-org/react";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { UserInterface } from "../../interfaces/user.interface";
import { useDeleteUserMutation, useGetUsersQuery } from "../../slices/usersApiSlice";
import { APIError } from "../../types/api-error.type";
import { apiErrorHandler } from "../../utils/errorUtils";

const UserListScreen = () => {
  const navigate = useNavigate();
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        toast.success("User removed");
        refetch();
      } catch (error) {
        apiErrorHandler(error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message color="danger" title="Error" description={(error as APIError)?.data?.message} />;

  return (
    <Card>
      <h1>Users</h1>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Admin</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No users found."}>
          {(users &&
            users.map((user: UserInterface) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? <FaCheck style={{ color: "green" }} /> : <FaTimes style={{ color: "red" }} />}</TableCell>
                <TableCell>
                  {!user.isAdmin && (
                    <div className="flex content-center">
                      <Button color="primary" variant="faded" onClick={() => navigate(`/admin/user/${user._id}/edit`)}>
                        <FaEdit />
                      </Button>

                      <Button color="danger" variant="bordered" onClick={() => deleteHandler(user._id || "")}>
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))) ||
            []}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserListScreen;
