import AWS from "aws-sdk";
import { toast } from "react-toastify";
import { AWSCredentials } from "../types/aws-creds.type";
import { apiErrorHandler } from "./errorUtils";

export const uploadFileToS3 = async (creds: AWSCredentials | undefined, file: File): Promise<string | null> => {
  console.log(`CREDS: `, creds);
  if (!creds) {
    console.error("No AWS credentials were found.");
    return null;
  }
  const isValidType = imageTypeValidator(file);
  if (!isValidType) {
    toast.error("Only jpg, jpeg and png types are supported.");
    return null;
  }

  const fileName = generateFileName(file);

  const params = {
    Bucket: "mern-bookstore-bucket",
    ContentType: file.type,
    Key: `images/${fileName}`,
    Body: file,
  };

  try {
    const s3 = new AWS.S3(creds);
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    apiErrorHandler(error);
    return null;
  }
};

const imageTypeValidator = (file: File) => {
  if (file.type) {
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const isValid = allowedExtensions.some((ext) => file.type.includes(ext));
    if (isValid) return true;
  }
  return false;
};

const generateFileName = (file: File) => {
  const fileExt = file.type.split("/")[1];
  return `${Date.now()}.${fileExt}`;
};
