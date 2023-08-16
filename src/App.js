import './App.css';
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { BrowserRouter, Navigate } from "react-router-dom";
import RoutesList from "./RoutesList";
// import backgroundImage from "./background-for-jobly.png";
import userContext from "./userContext";
import FrienderApi from "./api";
import jwt_decode from "jwt-decode";

function App() {
  //isLoading should be true
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(function updateLocalStorage() {
  //   console.log("logging out and resetting token");
  //   token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
  // }, [token]);

  /**gets user object from API upon receipt of JWT token */
  useEffect(() => {
    async function getUserData() {
      //added local memory storage adding and removal here instead of its own hook
      /** moving
       * const { username } = jwt_decode(token);
         FrienderApi.token = token;
         to inside the try block
       * */
      // const { username } = jwt_decode(token);
      // FrienderApi.token = token;
      try {
        const { username } = jwt_decode(token);
        FrienderApi.token = token;
        const userInfo = await FrienderApi.getUser(username);
        setIsLoading(false);
        setUser({ ...userInfo });
      } catch (err) {
        setError(err);
      }
    }
    if (!token) {
      setUser(null);
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", token);
      getUserData();
    }
  }, [token]);

  /**logs the current user out */
  function logout() {
    setIsLoading(false);
    setToken("");
  }

  /**logs a user in with proper credentials */
  async function login(formData) {
    const newToken = await FrienderApi.login(formData);
    setToken(newToken);
    setIsLoading(true);
  }

  /**allows a new user to sign up */
  async function signup(formData) {
    console.log("formData inside signup is>,", formData);
    const newToken = await FrienderApi.signup(formData);
    setToken(newToken);
    setIsLoading(true);
  }

  /**allows a user to update their own info when logged in */
  // async function update({username, lastName, email, firstName}) {
  //   const userInfo = await JrienderApi.updateUser({lastName, email, firstName}, username);
  //   setUser({ ...userInfo });
  // }

  if (error) return <Navigate to={`/404`} />;
  if (isLoading) return <h1 className="position-absolute top-50 start-50 text-dark">Loading....</h1>;

  return (
    <div className="App">
      <userContext.Provider value={ user }>
        <BrowserRouter>
          <NavBar logout={logout} />
          <RoutesList
            login={login}
            signup={signup} />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
