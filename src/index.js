import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-context";
import Layout from "./Layout/Layout";

ReactDOM.render(
  <BrowserRouter>
    <AuthContextProvider>
      <Layout>
        <App />
      </Layout>
    </AuthContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
