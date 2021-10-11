import React from "react";
import "./UserItem.css";
import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/players`}>
          <div className="user-item__image">
            <Avatar image={props.image} alt={props.name} referrerPolicy={props.referrerPolicy}></Avatar>
          </div>
          <div className="user-item__info">
            <h2>{props.equipo}</h2>
            <h4>{props.name}</h4>
            <h3>
              {props.playerCount}{" "}
              {props.playerCount === 1 ? "Jugador" : "Jugadores"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
