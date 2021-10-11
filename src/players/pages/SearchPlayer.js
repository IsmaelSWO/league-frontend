import React, { useEffect, useState, useContext } from "react";
import PlayerList from "../components/PlayerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Presupuesto from "../../shared/components/Navigation/Presupuesto";
import { AuthContext } from "../../shared/context/auth-context";
import SearchBox from "../components/SearchBox";


const SearchPlayer = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlayers, setLoadedPlayers] = useState();
  const [update, setUpdate] = useState(false);
  const auth = useContext(AuthContext);
  const [searchField, setSearchField] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [searchMaxClause, setSearchMaxClause] = useState("999999999999");
  const [searchMinClause, setSearchMinClause] = useState("0");
  const [searchFreeAgent, setSearchFreeAgent] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/players/top/ofertasrealizadas"
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

  /*  const pageCount = Math.ceil(users.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  }; */

  const onSearchChange = (event) => {
    setSearchField(event.target.value);
  };

  const onSearchPosition = (event) => {
    setSearchPosition(event.target.value);
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
            searchFreeAgent={onSearchFreeAgent}
          />
          <PlayerList
            items={loadedPlayers.filter((player) => {
              return (
                player.title
                  .toLowerCase()
                  .includes(searchField.toLowerCase()) &&
                player.address
                  .toLowerCase()
                  .includes(searchPosition.toLowerCase()) &&
                player.clausula >= searchMinClause &&
                player.clausula <= searchMaxClause &&
                player.creatorName.includes(searchFreeAgent)
              );
            })}
            searchField={searchField}
            searchPosition={searchPosition}
            searchMinClause={searchMinClause}
            searchMaxClause={searchMaxClause}
            searchFreeAgent={searchFreeAgent}
            onUpdate={updateHandler}
            onDeletePlayer={playerDeletedHandler}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default SearchPlayer;
