import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import PlayerList from "../components/PlayerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UserPlayers = () => {
  const [loadedPlayers, setLoadedPlayers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [update, setUpdate] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/players/user/${userId}`
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
    fetchPlayers();
  }, [sendRequest, userId, update]);

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
          onDeletePlayer={playerDeletedHandler}
          onUpdate={updateHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserPlayers;
