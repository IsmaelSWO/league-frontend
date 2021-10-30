import React, {useState, useEffect} from "react";
import Card from "../../shared/components/UIElements/Card";
import "./PlayerList.css";
import PlayerItem from "./PlayerItem";
import { Pagination } from "antd";
import "antd/dist/antd.css";

const PlayerList = (props) => {
  /* const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(""); */
  const [page, setPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(60);
  const total = props.items.length;
  let posts = props.items;

  if (props.searchField && props.searchFreeAgent && props.searchMaxClause && props.searchMinClause && props.searchPosition && props.searchTransferible) {
    posts = props.items.filter((player) => {
    return (
      player.title
        .toLowerCase()
        .includes(props.searchField.toLowerCase()) &&
      player.address
        .toLowerCase()
        .includes(props.searchPosition.toLowerCase()) &&
      player.clausula >= props.searchMinClause &&
      player.clausula <= props.searchMaxClause &&
      player.creatorName.includes(props.searchFreeAgent) &&
      player.transferible.toString().includes(props.searchTransferible) 
      //`${props.searchClausulable === "Si" ? player.Expires <= props.ahora : props.searchClausulable === "No" ? player.Expires <= props.ahora : player.Expires <= props.ahora || player.Expires > props.ahora}`
        /* .toLowerCase()
        .includes(props.searchTransferible.toLowerCase()) */
    );
  });
}

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No se encontraron jugadores</h2>
        </Card>
      </div>
    );
  }
  const indexOfLastPage = page + postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = posts.slice((page -1) * postPerPage, page*postPerPage);
  /* const currentPosts = posts.slice(indexOfFirstPage, indexOfLastPage); */

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
    <ul className="place-list">
      {currentPosts.map((player) => (
        <div className="child" key={player.id}>
          <PlayerItem
            key={player.id}
            id={player.id}
            image={player.image}
            title={player.title}
            clausula={player.clausula}
            transferible={player.transferible}
            marketValue={player.marketValue}
            address={player.address}
            posIndex={player.posIndex}
            team={player.team}
            discardExpiresDate={player.discardExpiresDate}
            clausulaInicial={player.clausulaInicial}
            ownerDiscard={player.ownerDiscard}
            creatorId={player.creator}
            escudo={player.escudo}
            creatorName={player.creatorName}
            Expires={player.Expires}
            ofertas={player.ofertas}
            onDelete={props.onDeletePlayer}
            onUpdate={props.onUpdate}
            onUpdateOffer={props.onUpdateOffer}
          ></PlayerItem>
        </div>
      ))}
    </ul>
      <div className="center paginator">
        <Pagination pageSize={postPerPage} itemRender={itemRender} total={total} current={page} onChange={(value) => setPage(value)} ishowQuickJumper showSizeChanger onShowSizeChange={onShowSizeChange}></Pagination>
      </div>
  </React.Fragment>
  );
};

export default PlayerList;
