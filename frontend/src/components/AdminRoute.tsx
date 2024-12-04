import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

const AdminRoute = () => {
  // referenced in main.tsx under the secured routes
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
