import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import PlayerList from "../../players/components/PlayerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const OfertasRecibidas = () => {
  const [loadedPlayers, setLoadedPlayers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [update, setUpdate] = useState(false);
  const userId = useParams().userId;

  useEffect(() => {
    //const abortCont = new AbortController();
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/players/user/${userId}`
          /*  { signal: abortCont.signal } */
        );
        setLoadedPlayers(
          responseData.players.filter((player) => player.ofertas.length > 0)
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
    //return () => abortCont.abort();
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
      {!isLoading && loadedPlayers && <Presupuesto></Presupuesto>}
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
          onUpdateOffer={updateHandler}
        />
      )}
    </React.Fragment>
  );
};

export default OfertasRecibidas;
