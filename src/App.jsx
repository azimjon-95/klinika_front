import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./components/login/Login";
import { routes } from "./routes/Routes";


function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine ? "Online" : "Offline");
  const token = localStorage.getItem("token"); // Check for token


  useEffect(() => {
    const handleOnline = () => {
      setIsOnline("Online");
      const timer = setTimeout(() => setIsOnline(null), 5000);
      return () => clearTimeout(timer);
    };
    const handleOffline = () => {
      setIsOnline("Offline");
      const timer = setTimeout(() => setIsOnline(null), 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      {!isOnline && (
        <p
          style={{ background: isOnline === "Offline" ? "red" : "#17cd32" }}
          className="isOnline"
        >
          {isOnline}
        </p>
      )}
      <Routes>
        <Route element={<Layout />}>
          {routes.map(({ path, element, private: isPrivate, role }) => (
            <Route
              key={path}
              path={path}
              element={
                isPrivate ? (
                  <PrivateRoute role={role}>{element}</PrivateRoute>
                ) : (
                  element
                )
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;