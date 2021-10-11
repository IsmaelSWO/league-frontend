import React, { useEffect, useState, useContext } from "react";
import MessageList from "../components/MessageList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import { AuthContext } from "../../shared/context/auth-context";

const TransferWall = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedMessages, setLoadedMessages] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/messages/get"
        );
        /* const userHasOffers = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/ofertas/get/receivedOffers/${auth.userId}`
        );

        var existing = localStorage.getItem("userData");
        existing = JSON.parse(existing);
        existing.hasOffers = userHasOffers;
        localStorage.setItem("userData", JSON.stringify(existing)); */

        setLoadedMessages(responseData.messages);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {auth.isLoggedIn && <Presupuesto></Presupuesto>}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedMessages && <MessageList items={loadedMessages} />}
    </React.Fragment>
  );
};

export default TransferWall;
