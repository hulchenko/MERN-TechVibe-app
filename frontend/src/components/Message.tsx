import { Alert } from "react-bootstrap";
import { MessageProps } from "../types/message-props.type";

const Message = ({ variant = "info", children }: MessageProps) => <Alert variant={variant}>{children}</Alert>;

export default Message;
