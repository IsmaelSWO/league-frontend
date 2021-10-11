import React from "react";
import "./MessageItem.css";
import Card from "../../shared/components/UIElements/Card";

const MessageItem = (props) => {
  return (
    <Card className="message-item__content">
      <div className="message-item__info">
        <p>
          {props.TransferMessage.substring(
            0,
            props.TransferMessage.lastIndexOf(".") + 1
          )}
        </p>
        <p>
          {props.TransferMessage.substring(
            props.TransferMessage.lastIndexOf(".") + 1
          )}
        </p>
      </div>
    </Card>
  );
};

export default MessageItem;
