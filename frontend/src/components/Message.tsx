import { Alert } from "@nextui-org/react";
import { MessageProps } from "../types/message-props.type";

const Message = ({ color = "primary", description = "", title = "" }: MessageProps) => (
  <>
    <Alert color={color} description={description} title={title} />
  </>
);

export default Message;
