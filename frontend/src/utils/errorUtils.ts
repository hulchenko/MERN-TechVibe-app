import { toast } from "react-toastify";
import { APIError } from "../types/api-error.type";

export const apiErrorHandler = (error: unknown) => {
  // Narrow down the type of error
  if ((error as APIError)?.data) {
    // Handle API error with data
    toast.error((error as APIError)?.data.message || "An API error occurred");
  } else if (error instanceof Error) {
    // Handle JavaScript Error
    toast.error(error.message);
  } else {
    toast.error("An unknown error occurred");
  }
};
