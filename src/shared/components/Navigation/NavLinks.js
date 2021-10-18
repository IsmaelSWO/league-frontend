import React, { useContext } from "react";
import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <ul className="nav-links">
        {auth.isLoggedIn && <li>¡Hola, {auth.userName}!</li>}
        {auth.isLoggedIn && (
          <li>
            <NavLink to={"/get/muro"} exact>
              Muro
            </NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li className="">
            <NavLink to={`/get/ofertasrecibidas/${auth.userId}`} exact>
              Ofertas recibidas
            </NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/get/ofertasrealizadas" exact>
              Ofertas realizadas
            </NavLink>
          </li>
        )}
        {/* {auth.isLoggedIn && (
          <li>
            <NavLink to="/players/mercado" exact>
              Mercado
            </NavLink>
          </li>
        )} */}
        <li>
          <NavLink to="/buscador" exact>
            Buscador
          </NavLink>
        </li>
        <li>
          <NavLink to="/primeradivision" exact>
            1ª División
          </NavLink>
        </li>
        <li>
          <NavLink to="/segundadivision" exact>
            2ª División
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/terceradivision" exact>
            3ª División
          </NavLink>
        </li>
        <li>
          <NavLink to="/cuartadivision" exact>
            4ª División
          </NavLink>
        </li> */}
        <li>
          <NavLink to="/" exact>
            Equipos
          </NavLink>
        </li>
        {auth.isLoggedIn && (
          <li>
            <NavLink to={`/get/mismovimientos`}>Mis movimientos</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to={`/${auth.userId}/players`}>Mis jugadores</NavLink>
          </li>
        )}
        {/* {auth.isLoggedIn && (
          <li>
            <NavLink to="/players/new">Añadir jugador</NavLink>
          </li>
        )} */}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/auth">Iniciar sesión</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button onClick={auth.logout}>Cerrar sesión</button>
          </li>
        )}
      </ul>
    </React.Fragment>
  );
};

export default NavLinks;
