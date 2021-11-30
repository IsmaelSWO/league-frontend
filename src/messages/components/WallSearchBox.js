import React from "react";
import "./WallSearchBox.css";

const SearchBox = (props) => {
  const ahora = Date.now();
  return (
    <div className="search-container">
      <div className="label-container">
        <label htmlFor="nombre">Transferencia</label>
        <input
          className="search"
          id="nombre"
          type="search"
          placeholder="Busca una transferencia..."
          onChange={props.searchChange}
        />
      </div>
    </div>
  );
};

export default SearchBox;
