import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [isAuth, setIsAuth] = useState(() => {
    // Initialize from localStorage (so reload keeps the value)
    return localStorage.getItem("isAuth") === "true";
  });

  // Whenever isAuth changes, persist it
  useEffect(() => {
    localStorage.setItem("isAuth", isAuth);
  }, [isAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
