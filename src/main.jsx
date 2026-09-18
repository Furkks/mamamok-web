import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPanel from "./AdminPanel";
import MentionsLegales from "./MentionsLegales";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")).render(
  path === "/admin" ? <AdminPanel /> :
  path === "/mentions-legales" ? <MentionsLegales /> :
  <App />
);