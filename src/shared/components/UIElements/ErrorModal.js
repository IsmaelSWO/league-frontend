import React from "react";

import Modal from "./Modal";
import Button from "../FormElements/Button";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="Ocurrió un error"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Vale</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
