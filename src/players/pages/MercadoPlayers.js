import React, { useEffect, useState, useContext } from "react";

import PlayerList from "../components/PlayerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import { AuthContext } from "../../shared/context/auth-context";

const MercadoPlayers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlayers, setLoadedPlayers] = useState();
  const [update, setUpdate] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/players/mercado"
        );

        setLoadedPlayers(responseData.players);
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
  }, [sendRequest, update]);
  const playerDeletedHandler = (deletedPlayerId) => {
    setLoadedPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== deletedPlayerId)
    );
  };
  const updateHandler = () => {
    setUpdate(!update);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {auth.isLoggedIn && !isLoading && loadedPlayers && (
        <Presupuesto></Presupuesto>
      )}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlayers && (
        <PlayerList
          items={loadedPlayers}
          onUpdate={updateHandler}
          onDeletePlayer={playerDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default MercadoPlayers;
