import React, { useContext, useEffect, useState } from "react";
import "./Presupuesto.css";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

const Presupuesto = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedPresupuesto, setLoadedPresupuesto] = useState(false);
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const responsePresupuestoUser = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setLoadedPresupuesto(
          responsePresupuestoUser.users
            .filter((user) => user.id === auth.userId)
            .map((user) => user.presupuesto)
        );
      } catch (err) {}
    };
    fetchOfertas();
  }, [sendRequest, auth.userId]);
  return (
    <div className="Presupuesto">
      <div>{loadedPresupuesto}</div>
      <div className="bucket-icon">
        <img
          src={require("../../../icons/sinchronize-xxl.png")}
          alt="Presupuesto"
        ></img>
      </div>
    </div>
  );
};

export default Presupuesto;
