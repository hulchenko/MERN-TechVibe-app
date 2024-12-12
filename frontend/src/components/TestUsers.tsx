import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks";
import { setCredentials } from "../slices/authSlice";
import { useGetTestUserCredentialsQuery, useLoginMutation } from "../slices/usersApiSlice";
import { APIError } from "../types/api-error.type";

const TestUsers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [loginApiCall, { isLoading }] = useLoginMutation();
  const { data: creds, error } = useGetTestUserCredentialsQuery(selectedType, { skip: !selectedType }); // Workaround for "Hooks can only be called inside of the body of a function component".

  useEffect(() => {
    if (creds) {
      logUserIn(creds);
    }
  }, [creds]);

  useEffect(() => {
    if (error) {
      toast.error((error as APIError)?.data?.message);
    }
  });

  const setUserType = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const type = (e.target as HTMLButtonElement).name;
    setSelectedType(type);
  };

  const logUserIn = async ({ creds }: { creds: string }) => {
    const email = creds.split(":")[0];
    const password = creds.split(":")[1];
    const response = await loginApiCall({ email, password }).unwrap();
    dispatch(setCredentials({ ...response }));
    navigate("/");
  };

  return (
    <Card className="rounded max-w-56 bg-transparent border border-gray-900 absolute bottom-12">
      <CardHeader>
        <div className="w-full text-center text-sm">
          <h2>Quick Join</h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex gap-2">
          <Button color="warning" variant="light" isLoading={isLoading && selectedType === "admin"} name="admin" onClick={(e) => setUserType(e)}>
            Admin
          </Button>
          <Button color="warning" variant="light" isLoading={isLoading && selectedType === "user"} name="user" onClick={(e) => setUserType(e)}>
            User
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default TestUsers;
