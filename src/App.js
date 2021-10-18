import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const Users = React.lazy(() => import("./users/pages/Users"));
const SearchPlayer = React.lazy(() => import("./players/pages/SearchPlayer"));
const UsersPrimera = React.lazy(() => import("./users/pages/UsersPrimera"));
const UsersSegunda = React.lazy(() => import("./users/pages/UsersSegunda"));
const UsersTercera = React.lazy(() => import("./users/pages/UsersTercera"));
const UsersCuarta = React.lazy(() => import("./users/pages/UsersCuarta"));
const Auth = React.lazy(() => import("./users/pages/Auth"));
const TransferWall = React.lazy(() => import("./messages/pages/TransferWall"));
const MyMovements = React.lazy(() => import("./messages/pages/MyMovements"));
const OfertasRealizadas = React.lazy(() =>
  import("./ofertas/pages/OfertasRealizadas")
);
const OfertasRecibidas = React.lazy(() =>
  import("./ofertas/pages/OfertasRecibidas")
);
const UserPlayers = React.lazy(() => import("./players/pages/UserPlayers"));
const MercadoPlayers = React.lazy(() =>
  import("./players/pages/MercadoPlayers")
);

const App = () => {
  const {
    token,
    login,
    logout,
    userId,
    userPresupuesto,
    userName,
    userTeam,
    userImage,
    hasOffers,
  } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users></Users>
        </Route>
        {/* <Route path="/players/mercado" exact>
          <MercadoPlayers></MercadoPlayers>
        </Route> */}
        <Route path="/:userId/players" exact>
          <UserPlayers></UserPlayers>
        </Route>
        <Route path="/get/mismovimientos" exact>
          <MyMovements></MyMovements>
        </Route>
        <Route path="/get/muro" exact>
          <TransferWall></TransferWall>
        </Route>
        <Route path="/buscador" exact>
          <SearchPlayer></SearchPlayer>
        </Route>
        <Route path="/primeradivision" exact>
          <UsersPrimera></UsersPrimera>
        </Route>
        <Route path="/segundadivision" exact>
          <UsersSegunda></UsersSegunda>
        </Route>
        {/* <Route path="/terceradivision" exact>
          <UsersTercera></UsersTercera>
        </Route>
        <Route path="/cuartadivision" exact>
          <UsersCuarta></UsersCuarta>
        </Route> */}
        <Route path="/get/ofertasrecibidas/:userId" exact>
          <OfertasRecibidas></OfertasRecibidas>
        </Route>
        <Route path="/get/ofertasrealizadas" exact>
          <OfertasRealizadas></OfertasRealizadas>
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users></Users>
        </Route>
        <Route path="/buscador" exact>
          <SearchPlayer></SearchPlayer>
        </Route>
        <Route path="/primeradivision" exact>
          <UsersPrimera></UsersPrimera>
        </Route>
        <Route path="/segundadivision" exact>
          <UsersSegunda></UsersSegunda>
        </Route>
        {/* <Route path="/terceradivision" exact>
          <UsersTercera></UsersTercera>
        </Route>
        <Route path="/cuartadivision" exact>
          <UsersCuarta></UsersCuarta>
        </Route> */}
        <Route path="/:userId/players" exact>
          <UserPlayers></UserPlayers>
        </Route>
        <Route path="/auth">
          <Auth></Auth>
        </Route>
        <Redirect to="/auth"></Redirect>
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userPresupuesto: userPresupuesto,
        userName: userName,
        userTeam: userTeam,
        userImage: userImage,
        login: login,
        logout: logout,
        hasOffers: hasOffers,
      }}
    >
      <Router>
        <MainNavigation></MainNavigation>
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner></LoadingSpinner>
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
