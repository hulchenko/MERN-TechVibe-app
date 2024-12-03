import { Card, CardBody } from "@nextui-org/react";
import { MessageProps } from "../types/message-props.type";

const Message = ({ variant = "info", children }: MessageProps) => (
  <Card>
    {/* TODO implement variant color change */}
    <CardBody>{children}</CardBody>
  </Card>
);

export default Message;
