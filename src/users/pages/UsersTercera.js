import React, { useEffect, useState, useContext } from "react";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import { AuthContext } from "../../shared/context/auth-context";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UsersTercera = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );

        setLoadedUsers(responseData.users);

        /* const userHasOffers = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/ofertas/get/receivedOffers/${auth.userId}`
        );

        var existing = localStorage.getItem("userData");
        existing = JSON.parse(existing);
        existing.hasOffers = userHasOffers;
        localStorage.setItem("userData", JSON.stringify(existing)); */
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
      {!isLoading && loadedUsers && (
        <UsersList
          items={loadedUsers.filter((user) => user.division === "Tercera")}
        />
      )}
    </React.Fragment>
  );
};

export default UsersTercera;
