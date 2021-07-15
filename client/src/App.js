import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import Login from "./components/screens/Authentication/Login";
import Signup from "./components/screens/Authentication/Signup";
import Profile from "./components/screens/Profile/CurrentUser/Profile";
import UserProfile from "./components/screens/Profile/IndividualUser/UserProfile";
import Home from "./components/screens/Home/Home";
import { reducer, initialState } from "./reducers/userReducer";
import Explore from "./components/screens/Explore/Explore";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/explore">
        <Explore />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <div className="app">
        <UserContext.Provider value={{ state, dispatch }}>
          <Router>
            <Navbar />
            <Routing />
          </Router>
        </UserContext.Provider>
      </div>
    </>
  );
}

export default App;
