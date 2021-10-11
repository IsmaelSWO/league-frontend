import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No se ha encontrado ningún equipo</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.filter((user) => user.equipo !== "Equipo no asignado" && user.equipo !== "Admin").map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          equipo={user.equipo}
          presupuesto={user.presupuesto}
          playerCount={user.players.length}
          division={user.division}
        ></UserItem>
      ))}
    </ul>
  );
};

export default UsersList;
