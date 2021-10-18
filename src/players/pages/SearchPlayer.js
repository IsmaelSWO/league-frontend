import React, { useEffect, useState, useContext } from "react";
import PlayerList from "../components/PlayerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import { AuthContext } from "../../shared/context/auth-context";
import SearchBox from "../components/SearchBox";


const SearchPlayer = () => {
  //const ahora = Date.now();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlayers, setLoadedPlayers] = useState();
  const [update, setUpdate] = useState(false);
  const auth = useContext(AuthContext);
  const [searchField, setSearchField] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [searchTransferible, setSearchTransferible] = useState("");
  const [searchMaxClause, setSearchMaxClause] = useState("999999999999");
  const [searchMinClause, setSearchMinClause] = useState("0");
  //const [searchClausulable, setSearchClausulable] = useState("");
  const [searchFreeAgent, setSearchFreeAgent] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/players/top/ofertasrealizadas"
        );

        setLoadedPlayers(responseData.players);
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

  const onSearchChange = (event) => {
    setSearchField(event.target.value);
  };

  const onSearchPosition = (event) => {
    setSearchPosition(event.target.value);
  };
  /* const onSearchClausulable = (event) => {
    setSearchClausulable(event.target.value);
  }; */

  const onSearchTransferible = (event) => {
    setSearchTransferible(event.target.value);
  };

  const onSearchMaxClause = (event) => {
    setSearchMaxClause(event.target.value);
  };

  const onSearchMinClause = (event) => {
    setSearchMinClause(event.target.value);
  };

  const onSearchFreeAgent = (event) => {
    setSearchFreeAgent(event.target.value);
  };

  if (searchMaxClause === "") {
    setSearchMaxClause("999999999999");
  }

  if (searchMinClause === "") {
    setSearchMinClause("0");
  }

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
        <React.Fragment>
          <SearchBox
            searchChange={onSearchChange}
            searchPosition={onSearchPosition}
            searchMaxClause={onSearchMaxClause}
            searchMinClause={onSearchMinClause}
            searchTransferible={onSearchTransferible}
            searchFreeAgent={onSearchFreeAgent}
            //searchClausulable={onSearchClausulable}
          />
          <PlayerList
            items={loadedPlayers.filter((player) => {
              /* let condition;
              if (searchClausulable === "Si") {
                condition = player.Expires <= ahora;
              }
              if (searchClausulable === "No") {
                condition = player.Expires > ahora;
              }
              if (searchClausulable === "") {
                condition = player.Expires <= ahora || player.Expires > ahora;
              } */
              return (
                player.title
                  .toLowerCase()
                  .includes(searchField.toLowerCase()) &&
                player.address
                  .toLowerCase()
                  .includes(searchPosition.toLowerCase()) &&
                player.clausula >= searchMinClause &&
                player.clausula <= searchMaxClause &&
                player.creatorName.includes(searchFreeAgent) &&
                player.transferible.toString().includes(searchTransferible) 
                //`${searchClausulable === "Si" ? player.Expires <= ahora : searchClausulable === "No" ? player.Expires <= ahora : player.Expires <= ahora || player.Expires > ahora}`
                  /* .toLowerCase()
                  .includes(searchTransferible.toLowerCase()) */
              );
            })}
            searchField={searchField}
            searchPosition={searchPosition}
            searchMinClause={searchMinClause}
            searchMaxClause={searchMaxClause}
            searchFreeAgent={searchFreeAgent}
            searchTransferible={searchTransferible}
            //searchClausulable={searchClausulable}
            //ahora={ahora}
            onUpdate={updateHandler}
            onDeletePlayer={playerDeletedHandler}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default SearchPlayer;
