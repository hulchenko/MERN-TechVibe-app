import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useDeleteUserMutation, useGetUsersQuery } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { APIError } from "../../types/api-error.type";
import { UserInterface } from "../../interfaces/user.interface";
import { apiErrorHandler } from "../../utils/errorUtils";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery(null);

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
  if (error) return <Message variant="danger">{(error as APIError).data?.message}</Message>;

  return (
    <>
      <h1>Users</h1>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserInterface) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>{user.isAdmin ? <FaCheck style={{ color: "green" }} /> : <FaTimes style={{ color: "red" }} />}</td>
              <td>
                {!user.isAdmin && (
                  <>
                    <LinkContainer to={`/admin/user/${user._id}/edit`} style={{ marginRight: "10px" }}>
                      <Button variant="light" className="btn-sm">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id || "")}>
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UserListScreen;
