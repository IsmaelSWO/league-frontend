import React, { useContext, useEffect, useState } from "react";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import PlayerList from "../../players/components/PlayerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const OfertasRealizadas = (props) => {
  const [loadedPlayers, setLoadedPlayers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [update, setUpdate] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/players/top/ofertasrealizadas"
        );
        setLoadedPlayers(
          responseData.players.filter((player) =>
            player.ofertas.some((oferta) => oferta.ofertanteId === auth.userId)
          )
        );
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
  }, [sendRequest, auth.userId, update]);

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
      {!isLoading && loadedPlayers && <Presupuesto></Presupuesto>}
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

export default OfertasRealizadas;
