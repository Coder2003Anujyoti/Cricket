import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login/Login"
import Admin from "./admin/Admin"
import Create from "./admin/Create.jsx"
import Protected from './protector/Protected.jsx'
const HomeRoutes = () => {
  return (
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<Protected><Admin /></Protected>} />
    <Route path="/create" element={<Protected><Create /></Protected>} />
    </Routes>
  )
}

export default HomeRoutes