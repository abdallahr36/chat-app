import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./Login";
import Chat from "./Chat";
import Register from "./Register";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <Chat onLogout={() => setLoggedIn(false)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
