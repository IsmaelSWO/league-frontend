import React, {useState} from "react";
import "./MessageList.css";
import MessageItem from "./MessageItem";
import Card from "../../shared/components/UIElements/Card";
import { Pagination } from "antd";
import "antd/dist/antd.css";

const MessageList = (props) => {
  const [page, setPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(60);
  const total = props.items.length;
  let posts = props.items;
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No se ha encontrado ninguna transferencia</h2>
        </Card>
      </div>
    );
  }

  const indexOfLastPage = page + postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = posts.slice((page -1) * postPerPage, page*postPerPage);

  const onShowSizeChange = (current, pageSize) => {
    setPostPerPage(pageSize);
  }

  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <a>Anterior</a>
    }
    if (type === "next") {
      return <a>Siguiente</a>
    }

    return originalElement;
  }

  return (
    <React.Fragment>
      <ul className="users-list">
        {currentPosts.map((message) => (
          <MessageItem
            key={message.id}
            id={message.id}
            TransferMessage={message.TransferMessage}
          ></MessageItem>
        ))}
      </ul>
      <div className="center paginator">
          <Pagination pageSize={postPerPage} itemRender={itemRender} total={total} current={page} onChange={(value) => setPage(value)} ishowQuickJumper showSizeChanger onShowSizeChange={onShowSizeChange}></Pagination>
      </div>
    </React.Fragment>
  );
};

export default MessageList;
