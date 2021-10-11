import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  userPresupuesto: null,
  userName: null,
  userTeam: null,
  userImage: null,
  hasOffers: null,
  login: () => {},
  logout: () => {},
});
