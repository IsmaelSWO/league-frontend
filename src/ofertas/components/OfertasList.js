import React from "react";
import "./OfertasList.css";
import OfertaItem from "./OfertaItem";
import Card from "../../shared/components/UIElements/Card";

const OfertasList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No ofertas found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="offer-list">
      {props.items.map((oferta) => (
        <OfertaItem
          key={oferta.id}
          id={oferta.id}
          cantidad={oferta.cantidad}
          ofertanteId={oferta.ofertanteId}
          playerId={oferta.playerId}
          equipoOfertante={oferta.equipoOfertante}
          nombreOfertante={oferta.nombreOfertante}
          escudoOfertante={oferta.escudoOfertante}
          onDelete={props.onDeleteOferta}
          onDeletePlayer={props.onDeletePlayer}
        ></OfertaItem>
      ))}
    </ul>
  );
};

export default OfertasList;
