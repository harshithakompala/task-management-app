import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthComponent from "./Authorization/AuthComponent";
import TaskForm from "./Authorization/TaskForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Authorization/firebaseConfig";

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>; // Avoid redirecting while Firebase is still checking auth state

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/tasks" /> : <AuthComponent />} />
      <Route path="/tasks" element={user ? <TaskForm user={user}/> : <Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthComponent />} />
    </Routes>
  );
};

export default App;
