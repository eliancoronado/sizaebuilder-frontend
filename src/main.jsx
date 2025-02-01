import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import AppB from "./App/AppB.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/register/Register.jsx";
//https://sizaebuilder-backend.onrender.com
const URL = "http://localhost:4000";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App url={URL} />} />
        <Route path="/login" element={<Login url={URL} />} />
        <Route path="/register" element={<Register url={URL} />} />
        <Route path="/project/:id" element={<AppB modeScreen="complete" />} />
        <Route path="/project/left/:id" element={<AppB modeScreen="partLeft" />} />
        <Route path="/project/central/:id" element={<AppB modeScreen="partCentral" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
