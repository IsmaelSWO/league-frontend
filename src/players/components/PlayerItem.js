import React, { useState, useContext, useEffect, useRef } from "react";
import Card from "../../shared/components/UIElements/Card";
import "./PlayerItem.css";
import OfertasList from "../../ofertas/components/OfertasList";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_NUMBER,
  VALIDATOR_GREATERZERO,
} from "../../shared/util/validators";

const PlayerItem = (props) => {
  const clausulaAntigua = Number(props.clausula);
  const inputRef =useRef();
  const [quantity, setQuantity] = useState(0);
  const addingMiliseconds = 1324;
  const ahora = Date.now();
  const playerId = props.id;
  const [formState, inputHandler] = useForm(
    {
      cantidad: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedOfertas, setLoadedOfertas] = useState();
  const [showConfirmOfertaModal, setShowConfirmOfertaModal] = useState(false);
  const [showFreeBuyModal, setShowFreeBuyModal] = useState(false);
  const [showVerOfertasModal, setShowVerOfertasModal] = useState(false);
  const [showSubirClausulaModal, setShowSubirClausulaModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSetTransferibleModal, setShowSetTransferibleModal] =
    useState(false);
  const [update, setUpdate] = useState(false);

  const [showConfirmClausulaModal, setShowConfirmClausulaModal] =
    useState(false);
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/ofertas/player/${playerId}`
        );
        setLoadedOfertas(responseData.ofertas);
      } catch (err) {}
    };
    fetchOfertas();
  }, [sendRequest, playerId, update]);
  const openVerOfertasHandler = () => {
    setShowVerOfertasModal(true);
  };
  const openSetTransferiblePlayerHandler = () => {
    setShowSetTransferibleModal(true);
  };
  const closeVerOfertasHandler = () => setShowVerOfertasModal(false);
  const openOfertaHandler = () => setShowConfirmOfertaModal(true);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const showClausulaWarningHandler = () => {
    setShowConfirmClausulaModal(true);
  };

  const showFreeBuyWarningHandler = () => {
    setShowFreeBuyModal(true);
  };

  const showSubirClausulaHandler = () => {
    setShowSubirClausulaModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const cancelClausulaHandler = () => {
    setShowConfirmClausulaModal(false);
    setShowFreeBuyModal(false);
  };
  const cancelOfertaHandler = () => {
    setShowConfirmOfertaModal(false);
    setShowSubirClausulaModal(false);
    setShowSetTransferibleModal(false);
  };

  const confirmSetTransferiblePlayerHandler = async () => {
    setShowSetTransferibleModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/transferible/${props.id}`,
        "PATCH",
        JSON.stringify({
          transferible: true,
          marketValue: Number(formState.inputs.cantidad.value),
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onUpdate();
    } catch (err) {}
  };

  const cancelTransferiblePlayerHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/transferible/${props.id}`,
        "PATCH",
        JSON.stringify({
          transferible: false,
          marketValue: 0,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onUpdate();
    } catch (err) {}
  };

  const confirmFreeBuyHandler = async () => {
    setShowFreeBuyModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/delete/${props.id}/${auth.userId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const now = Date.now();
      const Expires = now + addingMiliseconds;
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/${props.id}`,
        "POST",
        JSON.stringify({
          title: props.title,
          clausula: props.clausulaInicial,
          address: props.address,
          image: props.image,
          escudo: auth.userImage,
          clausulaInicial: props.clausulaInicial,
          Expires: Expires,
          team: auth.userTeam,
          creatorName: auth.userName,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/messages/post",
        "POST",
        JSON.stringify({
          TransferMessage: `${auth.userName} (${
            auth.userTeam
          }) ha fichado a coste cero al descarte ${props.title}. ${day}/${
            month < 10 ? "0" + month : month
          }/${year} ${hour < 10 ? "0" + hour : hour}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
      props.onUpdate();
    } catch (err) {}
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const now = Date.now();
      const weekMiliseconds = /* 604800000 */ 343;
      const Expires = now + addingMiliseconds;
      const discardExpiresDate = now + weekMiliseconds;
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/discarded/${auth.userId}`,
        "POST",
        JSON.stringify({
          title: props.title,
          clausula: props.clausulaInicial,
          address: props.address,
          image: props.image,
          escudo: "https://i.imgur.com/mhqxl7l.png",
          Expires: Expires,
          clausulaInicial: props.clausulaInicial,
          team: "Sin equipo",
          ownerDiscard: auth.userId,
          discardExpiresDate: discardExpiresDate,
          creatorName: "Agente Libre",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/messages/post",
        "POST",
        JSON.stringify({
          TransferMessage: `${auth.userName} (${
            auth.userTeam
          }) ha descartado a ${props.title}. ${day}/${
            month < 10 ? "0" + month : month
          }/${year} ${hour < 10 ? "0" + hour : hour}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  const retirarOfertaHandler = async () => {
    const identifiedOferta = loadedOfertas
      .filter((oferta) => oferta.ofertanteId === auth.userId)
      .map((oferta) => oferta.id);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/ofertas/${identifiedOferta}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setLoadedOfertas(
        loadedOfertas.filter((oferta) => oferta.id !== identifiedOferta)
      );
      props.onUpdate();
    } catch (err) {}
  };
  const confirmSubirClausulaHandler = async () => {
    setShowSubirClausulaModal(false);
    let filteredQuantity = quantity
    if (quantity > 0 || quantity < 0 && quantity <=-1) {
     filteredQuantity = Math.round(Number(quantity));
    }
    else {
      filteredQuantity = Math.round(Number(quantity)) - 5;
    }
    try {
      const responsePresupuestoUser = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users"
      );
      const PresupuestoUser = responsePresupuestoUser.users
        .filter((user) => user.id === auth.userId)
        .map((user) => user.presupuesto);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/${props.id}`,
        "PATCH",
        JSON.stringify({
          clausula: clausulaAntigua + filteredQuantity,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      /* const diferenciaClausulas =
        Number(formState.inputs.cantidad.value) - clausulaAntigua; */
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/pagarclausula/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          presupuesto: Number(PresupuestoUser) - filteredQuantity,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onUpdate();
      //history.push("/");
    } catch (err) {}
  };
  const confirmClausulaHandler = async () => {
    setShowConfirmClausulaModal(false);
    try {
      const responsePresupuestoUser = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users"
      );
      const PresupuestoUser = responsePresupuestoUser.users
        .filter((user) => user.id === auth.userId)
        .map((user) => user.presupuesto);
      const responsePresupuestoCreator = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users"
      );
      const PresupuestoCreator = responsePresupuestoCreator.users
        .filter((user) => user.id === props.creatorId)
        .map((user) => user.presupuesto);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/ofertas/get/${props.clausula}/${props.id}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/pagarclausula/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          presupuesto: Number(PresupuestoUser) - props.clausula,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/pagarclausula/${props.creatorId}`,
        "PATCH",
        JSON.stringify({
          presupuesto: Number(PresupuestoCreator) + props.clausula,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      const now = Date.now();
      const Expires = now + addingMiliseconds;
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/${props.id}`,
        "POST",
        JSON.stringify({
          title: props.title,
          clausula: props.clausula,
          address: props.address,
          image: props.image,
          Expires: Expires,
          team: auth.userTeam,
          clausulaInicial: props.clausulaInicial,
          escudo: auth.userImage,
          creatorName: auth.userName,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/messages/post",
        "POST",
        JSON.stringify({
          TransferMessage: `${auth.userName} (${
            auth.userTeam
          }) ha pagado la cláusula de rescisión de ${props.title} a ${
            props.creatorName
          } (${props.team}) por ${props.clausula} monedas. ${day}/${
            month < 10 ? "0" + month : month
          }/${year} ${hour < 10 ? "0" + hour : hour}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
      props.onUpdate();
    } catch (err) {}
  };
  const confirmOfertaHandler = async () => {
    setShowConfirmOfertaModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/ofertas/${props.clausula}/${formState.inputs.cantidad.value}`,
        "POST",
        JSON.stringify({
          cantidad: Number(formState.inputs.cantidad.value),
          ofertanteId: auth.userId,
          playerId: props.id,
          equipoOfertante: auth.userTeam,
          nombreOfertante: auth.userName,
          escudoOfertante: auth.userImage,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onUpdate();
      //history.push("/");
    } catch (err) {}
  };
  const editarOfertaHandler = async () => {
    setShowConfirmOfertaModal(false);
    const IdentifiedOferta = loadedOfertas
      .filter((oferta) => oferta.ofertanteId === auth.userId)
      .map((oferta) => oferta.id);
    try {
      /* const responseData = await sendRequest(
        `http://localhost:5000/api/ofertas/player/${playerId}`
      );
      const setLoadedOfertas = responseData.ofertas.filter(
        (oferta) => oferta.ofertanteId === auth.userId
      ); */
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/ofertas/${IdentifiedOferta}/${props.clausula}/${formState.inputs.cantidad.value}/${props.id}`,
        "PATCH",
        JSON.stringify({
          cantidad: Number(formState.inputs.cantidad.value),
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onUpdate();

      //props.onDelete(props.id);
      //history.push("/");
    } catch (err) {}
  };
  const updateHandler = () => {
    setUpdate(!update);
  };

  const OfertaDeletedHandler = (deletedOfertaId) => {
    setLoadedOfertas((prevOfertas) =>
      prevOfertas.filter((oferta) => oferta.id !== deletedOfertaId)
    );
    if (loadedOfertas.length === 1) {
      props.onUpdate();
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {loadedOfertas && (
        <Modal
          show={showVerOfertasModal}
          onCancel={closeVerOfertasHandler}
          header="Ofertas recibidas"
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<Button onClick={closeVerOfertasHandler}>CERRAR</Button>}
        >
          <div className="map-container">
            <OfertasList
              items={loadedOfertas}
              onDeleteOferta={OfertaDeletedHandler}
              onUpdate={updateHandler}
              onDeletePlayer={props.onUpdate}
            ></OfertasList>
          </div>
        </Modal>
      )}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="¿Descartar al jugador?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              NO DESCARTAR
            </Button>
            <Button danger onClick={confirmDeleteHandler} disabled>
              DESCARTAR
            </Button>
          </React.Fragment>
        }
      >
        <p>
          ¿Estás seguro de que quieres descartar al jugador? No recibirás
          compensación económica alguna.
        </p>
      </Modal>
      <Modal
        show={showConfirmClausulaModal}
        onCancel={cancelClausulaHandler}
        header="¿Pagar cláusula?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelClausulaHandler}>
              NO PAGAR CLÁUSULA
            </Button>
            <Button danger onClick={confirmClausulaHandler} disabled>
              PAGAR CLÁUSULA
            </Button>
          </React.Fragment>
        }
      >
        <p>¿Estás seguro de que quieres pagar la cláusula de rescisión?</p>
      </Modal>
      <Modal
        show={showFreeBuyModal}
        onCancel={cancelClausulaHandler}
        header="¿Fichar gratis al jugador?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelClausulaHandler}>
              CANCELAR
            </Button>
            <Button danger onClick={confirmFreeBuyHandler} disabled={auth.userTeam="Equipo no asignado"}>
              FICHAR GRATIS
            </Button>
          </React.Fragment>
        }
      >
        <p>¿Quieres fichar gratis al jugador?</p>
      </Modal>
      <Modal
        show={showConfirmOfertaModal}
        onCancel={cancelOfertaHandler}
        header="¿Enviar oferta?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelOfertaHandler}>
              CANCELAR
            </Button>
          </React.Fragment>
        }
      >
        <p>Haz una oferta por este jugador</p>
        {/* <form className="place-form" onSubmit={confirmOfertaHandler}> */}
        <Input
          element="input"
          id="cantidad"
          type="number"
          label="Cantidad"
          validators={[
            VALIDATOR_NUMBER(),
            VALIDATOR_REQUIRE(),
            VALIDATOR_GREATERZERO(),
          ]}
          errorText="Por favor, introduce una cantidad válida."
          onInput={inputHandler}
        ></Input>
        <Button
          type="button"
          disabled={!formState.isValid}
          onClick={confirmOfertaHandler}
        >
          ENVIAR OFERTA
        </Button>
        {/* </form> */}
      </Modal>
      <Modal
        show={showSetTransferibleModal}
        onCancel={cancelOfertaHandler}
        header="Poner a la venta"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelOfertaHandler}>
              CANCELAR
            </Button>
          </React.Fragment>
        }
      >
        <p>Indica un precio deseado para la venta de este jugador.</p>
        {/* <form className="place-form" onSubmit={confirmOfertaHandler}> */}
        <Input
          element="input"
          id="cantidad"
          type="number"
          label="Cantidad"
          validators={[
            VALIDATOR_NUMBER(),
            VALIDATOR_REQUIRE(),
            VALIDATOR_GREATERZERO(),
          ]}
          errorText="Por favor, introduce una cantidad válida."
          onInput={inputHandler}
        ></Input>
        <Button
          type="button"
          disabled={!formState.isValid}
          onClick={confirmSetTransferiblePlayerHandler}
        >
          PONER A LA VENTA
        </Button>
        {/* </form> */}
      </Modal>
      {loadedOfertas &&
        loadedOfertas.filter((oferta) => oferta.ofertanteId === auth.userId)
          .length > 0 && (
          <Modal
            show={showConfirmOfertaModal}
            onCancel={cancelOfertaHandler}
            header="Edita?"
            footerClass="place-item__modal-actions"
            footer={
              <React.Fragment>
                <Button inverse onClick={cancelOfertaHandler}>
                  CANCELAR
                </Button>
              </React.Fragment>
            }
          >
            <p>Edita la oferta que has hecho por el jugador</p>
            {/* <form className="place-form" onSubmit={editarOfertaHandler}> */}
            <Input
              element="input"
              id="cantidad"
              type="number"
              label="Cantidad"
              validators={[
                VALIDATOR_NUMBER(),
                VALIDATOR_REQUIRE(),
                VALIDATOR_GREATERZERO(),
              ]}
              errorText="Por favor, introduce una cantidad válida."
              onInput={inputHandler}
            ></Input>
            <Button
              type="button"
              disabled={!formState.isValid}
              onClick={editarOfertaHandler}
            >
              ENVIAR OFERTA
            </Button>
            {/*  </form> */}
          </Modal>
        )}
      <Modal
        show={showSubirClausulaModal}
        onCancel={cancelOfertaHandler}
        header="¿Subir la cláusula?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelOfertaHandler}>
              CANCELAR
            </Button>
          </React.Fragment>
        }
      >
        <p>Establece cuánto quieres subir la cláusula de rescisión</p>
        {/* <form className="place-form" onSubmit={confirmSubirClausulaHandler}> */}
        {/* {<Input
          element="input"
          id="cantidad"
          type="number"
          label="Cantidad"
          validators={[
            VALIDATOR_NUMBER(),
            VALIDATOR_REQUIRE(),
            VALIDATOR_GREATERZERO(),
          ]}
          errorText="Por favor, introduce una cantidad válida."
          onInput={inputHandler}
          onChange={e => setQuantity(e.target.value) }
        ></Input>} */}
        <div className="center"><input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="0" step="1"/></div>
        {!(/^[0-9]*$/.test(quantity)) &&
          <div className="validate center">Introduce un número entero</div>
        }
        {quantity <= 0 &&
          <div className="validate center">Introduce un número positivo</div>
        }
        <div className="player_clause center">La nueva cláusula de rescisión sería de {quantity && /^[0-9]*$/.test(quantity) > 0 ? clausulaAntigua + Math.round(Number(quantity)) : clausulaAntigua} monedas</div>
        <div className="center">
          <Button
            type="button"
            /* disabled={!formState.isValid} */
            disabled={/* ahora > 13 &&  *//* props.team !== "Admin" || */ quantity <= 0 || !(/^[0-9]*$/.test(quantity))}
            onClick={confirmSubirClausulaHandler}
          >
            SUBIR CLÁUSULA
          </Button>
        </div>
        {/* </form> */}
      </Modal>
      <li className="place-item">
        <Card
          className={
            /* props.team === "Sevilla FC"
              ? "sevilla-item__content"
              : props.team === "Manchester United"
              ? "manutd-item__content"
              : props.team === "AC Milan"
              ? "milan-item__content"
              : props.team === "Real Madrid"
              ? "madrid-item__content"
              : props.team === "Liverpool"
              ? "liverpool-item__content"
              : props.team === "Real Sociedad"
              ? "realsoc-item__content"
              : props.team === "PSG"
              ? "psg-item__content"
              : props.team === "Valencia"
              ? "valencia-item__content"
              :  */props.team === "Sin equipo"
              ? "freeagent-item__content"
              /* : props.team === "Atlético de Madrid"
              ? "atletico-item__content"
              : props.team === "RB Leipzig"
              ? "leipzig-item__content"
              : props.team === "Arsenal"
              ? "arsenal-item__content"
              : props.team === "FC Porto"
              ? "porto-item__content"
              : props.team === "Cheslea"
              ? "chelsea-item__content"
              : props.team === "Inter"
              ? "inter-item__content"
              : props.team === "Manchester City"
              ? "mancity-item__content"
              : props.team === "Athletic Club"
              ? "athletic-item__content"
              : props.team === "Atlético de Madrid"
              ? "atletico-item__content"
              : props.team === "Tottenham Hotspur"
              ? "spur-item__content"
              : props.team === "Bayern München"
              ? "bayern-item__content"
              : props.team === "SL Benfica"
              ? "benfica-item__content"
              : props.team === "Borussia Dortmund"
              ? "bvb-item__content"
              : props.team === "Real Betis"
              ? "betis-item__content"
              : props.team === "Ajax"
              ? "ajax-item__content"
              : props.team === "Villarreal"
              ? "villarreal-item__content"
              : props.team === "Olympique Lyonnais"
              ? "lyon-item__content" */
              : "newManager-item__content"
          }
        >
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className={props.address === "POR"
                  ? "place-item__image POR-background"
                  : props.address === "MC" ||
                    props.address === "MCO" ||
                    props.address === "MCD" ||
                    props.address === "MD" ||
                    props.address === "MI"
                  ? "place-item__image MC-background"
                  : props.address === "DC" ||
                    props.address === "ED" ||
                    props.address === "SD" ||
                    props.address === "EI"
                  ? "place-item__image DC-background"
                  : props.address === "DFC" ||
                    props.address === "LD" ||
                    props.address === "LI" ||
                    props.address === "CAR" ||
                    props.address === "CAI"
                  ? "place-item__image DFC-background"
                  : ""}>
            <img src={`https://images.weserv.nl/?url=${props.image}`} alt={props.title} referrerPolicy="no-referrer"></img>
            <h3>{props.title}</h3>
            <div
              className={
                props.address === "POR"
                  ? "POR"
                  : props.address === "MC" ||
                    props.address === "MCO" ||
                    props.address === "MCD" ||
                    props.address === "MD" ||
                    props.address === "MI"
                  ? "MC"
                  : props.address === "DC" ||
                    props.address === "ED" ||
                    props.address === "SD" ||
                    props.address === "EI"
                  ? "DC"
                  : props.address === "DFC" ||
                    props.address === "LD" ||
                    props.address === "LI" ||
                    props.address === "CAR" ||
                    props.address === "CAI"
                  ? "DFC"
                  : ""
              }
            >
              {props.address}
            </div>
          </div>
          <div className="place-item__info">
            {/* <h2>{props.title}</h2> */}
            {/* <div
              className={
                props.address === "POR"
                  ? "POR"
                  : props.address === "MC" ||
                    props.address === "MCO" ||
                    props.address === "MCD" ||
                    props.address === "MD" ||
                    props.address === "MI"
                  ? "MC"
                  : props.address === "DC" ||
                    props.address === "ED" ||
                    props.address === "SD" ||
                    props.address === "EI"
                  ? "DC"
                  : props.address === "DFC" ||
                    props.address === "LD" ||
                    props.address === "LI" ||
                    props.address === "CAR" ||
                    props.address === "CAI"
                  ? "DFC"
                  : ""
              }
            >
              {props.address}
            </div> */}
            <div className="vital-info">
              <div className="container-escudo">
                <div className="escudo">
                  <div className="escudo-img">
                    <img src={`https://images.weserv.nl/?url=${props.escudo}`} alt={props.escudo} width="80px" height="80px"></img>
                  </div>
                </div>
              </div>
              <div className="container-clausula">
                <div className="importe_clausula">
                  <div className="candado-img">
                    <img
                      src={require("../../icons/candado.png")}
                      alt={props.clausula}
                    ></img>
                  </div>
                  <div>
                    <h4>{props.clausula}</h4>
                  </div>
                  <div className="money-img">
                    <img
                      src={require("../../icons/sinchronize-xxl.png")}
                      alt={props.clausula}
                    ></img>
                  </div>
                </div>
              </div>
              {props.marketValue !== 0 && (
                <div className="container-marketValue">
                  <div className="marketValue">
                    <div className="descriptive-img">
                      <img
                        src={require("../../icons/acuerdo.png")}
                        alt={props.marketValue}
                      ></img>
                    </div>
                    <div>
                      <h4>{props.marketValue}</h4>
                    </div>
                    <div className="money-img">
                      <img
                        src={require("../../icons/sinchronize-xxl.png")}
                        alt={props.clausula}
                      ></img>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="place-item__actions">
            {auth.isLoggedIn &&
              auth.userId !== props.creatorId &&
              /* props.team !== "Sin equipo" && */
              props.creatorName !== "Agente Libre" && (
                <Button
                  danger
                  onClick={showClausulaWarningHandler}
                  disabled={ahora < props.Expires}
                >
                  PAGAR CLÁUSULA
                </Button>
              )}
            {auth.isLoggedIn &&
              props.team === "Sin equipo" &&
              props.creatorName === "Agente Libre" && (
                <Button
                  danger
                  onClick={showFreeBuyWarningHandler}
                  disabled={
                    auth.userId === props.ownerDiscard &&
                    ahora < props.discardExpiresDate
                  }
                  disabled={auth.userTeam="Equipo no asignado"}
                >
                  FICHAR GRATIS
                </Button>
              )}
            {auth.isLoggedIn &&
              auth.userId !== props.creatorId &&
              /* props.team !== "Sin equipo" && */
              props.creatorName !== "Agente Libre" && (
                <Button onClick={openOfertaHandler} disabled>
                  {loadedOfertas &&
                  loadedOfertas.filter(
                    (oferta) => oferta.ofertanteId === auth.userId
                  ).length > 0
                    ? `EDITAR OFERTA (${loadedOfertas
                        .filter((oferta) => oferta.ofertanteId === auth.userId)
                        .map((oferta) => oferta.cantidad)}M)`
                    : "HACER OFERTA"}
                </Button>
              )}
            {auth.isLoggedIn &&
              auth.userId !== props.creatorId &&
              loadedOfertas &&
              loadedOfertas.filter(
                (oferta) => oferta.ofertanteId === auth.userId
              ).length > 0 &&
              /* props.team !== "Sin equipo" && */
              props.creatorName !== "Agente Libre" && (
                <Button onClick={retirarOfertaHandler}>RETIRAR OFERTA</Button>
              )}
            {auth.userId === props.creatorId && (
              <Button onClick={showSubirClausulaHandler}>SUBIR CLÁUSULA</Button>
            )}
            {auth.userId === props.creatorId &&
              props.transferible === false && (
                <Button onClick={openSetTransferiblePlayerHandler}>
                  PONER A LA VENTA
                </Button>
              )}
            {auth.userId === props.creatorId && props.transferible === true && (
              <Button onClick={cancelTransferiblePlayerHandler}>
                QUITAR DEL MERCADO
              </Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler} disabled>
                DESCARTAR JUGADOR
              </Button>
            )}
            {auth.userId === props.creatorId && props.ofertas.length > 0 && (
              <Button onClick={openVerOfertasHandler}>VER OFERTAS</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default PlayerItem;
