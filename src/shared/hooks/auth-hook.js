import { useState, useCallback, useEffect } from "react";
import decode from "jwt-decode";

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [userPresupuesto, setUserPresupuesto] = useState(false);
  const [userName, setUserName] = useState(false);
  const [userTeam, setUserTeam] = useState(false);
  const [userImage, setUserImage] = useState(false);
  const [hasOffers, setHasOffers] = useState(false);

  let isTokenExpired;
  isTokenExpired = (token) => {
    try {
      return decode(token).exp > Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };

  const login = useCallback(
    (uid, token, uPresupuesto, uName, uTeam, uImage, uHasOffers) => {
      setToken(token);
      setUserId(uid);
      setUserPresupuesto(uPresupuesto);
      setUserName(uName);
      setUserTeam(uTeam);
      setUserImage(uImage);
      setHasOffers(uHasOffers);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token,
          exp: decode(token).exp,
          presupuesto: uPresupuesto,
          userName: uName,
          equipo: uTeam,
          image: uImage,
          hasOffers: uHasOffers,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserPresupuesto(null);
    setUserName(null);
    setUserTeam(null);
    setUserImage(null);
    setHasOffers(null);
    localStorage.removeItem("userData");
  }, []);

  // Automatic logout
  useEffect(() => {
    if (token) {
      const remainingTime =
        new Date(decode(token).exp).getTime() * 1000 - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout]);

  // Automatic login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      if (isTokenExpired(storedData.token)) {
        login(
          storedData.userId,
          storedData.token,
          storedData.presupuesto,
          storedData.userName,
          storedData.equipo,
          storedData.image,
          storedData.hasOffers
        );
      }
    }
  }, [login, isTokenExpired]);

  return {
    token,
    login,
    logout,
    userId,
    userPresupuesto,
    userName,
    userTeam,
    userImage,
    hasOffers,
  };
};
