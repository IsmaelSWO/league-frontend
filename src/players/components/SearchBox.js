import React from "react";
import "./SearchBox.css";

const SearchBox = (props) => {
  return (
    <div className="search-container">
      <div className="label-container">
        <label htmlFor="nombre">Nombre jugador</label>
        <input
          className="search"
          id="nombre"
          type="search"
          placeholder="Introduce un nombre..."
          onChange={props.searchChange}
        />
      </div>
      <div className="label-container">
        <label htmlFor="selectPosition">Posición</label>
        <select
          id="selectPosition"
          className="search"
          onChange={props.searchPosition}
        >
          <option value="">Cualquier posición</option>
          <option className="POR" value="POR">
            POR
          </option>
          <option className="DFC" value="DFC">
            DFC
          </option>
          <option className="DFC" value="CAR">
            CAR
          </option>
          <option className="DFC" value="LD">
            LD
          </option>
          <option className="DFC" value="LI">
            LI
          </option>
          <option className="MC" value="MCD">
            MCD
          </option>
          <option className="MC" value="MC">
            MC
          </option>
          <option className="MC" value="MCO">
            MCO
          </option>
          <option className="MC" value="MD">
            MD
          </option>
          <option className="MC" value="MI">
            MI
          </option>
          <option className="DC" value="EI">
            EI
          </option>
          <option className="DC" value="ED">
            ED
          </option>
          <option className="DC" value="SDI">
            SDI
          </option>
          <option className="DC" value="SDD">
            SDD
          </option>
          <option className="DC" value="SD">
            SD
          </option>
          <option className="DC" value="DC">
            DC
          </option>
        </select>
      </div>
      <div className="label-container">
        <label htmlFor="searchPosition">Equipo</label>
        <select
          id="searchPosition"
          className="search"
          onChange={props.searchFreeAgent}
        >
          <option value="">Cualquier equipo</option>
          <option value="Agente Libre">Agente Libre</option>
        </select>
      </div>
      <div className="label-container">
        <label htmlFor="clausulaminima">Cláusula minima</label>
        <input
          id="clausulaminima"
          className="search"
          onChange={props.searchMinClause}
          onInput={props.searchMinClause}
          min="1"
          step="1"
          placeholder="Cláusula mínima"
          type="number"
        ></input>
      </div>

      <div className="label-container">
        <label htmlFor="clausulamaxima">Cláusula máxima </label>
        <input
          id="clausulamaxima"
          className="search"
          min="1"
          step="1"
          onChange={props.searchMaxClause}
          placeholder="Cláusula máxima"
          onInput={props.searchMaxClause}
          type="number"
        ></input>
      </div>
    </div>
  );
};

export default SearchBox;
