/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom/client";
// import Cookies from "universal-cookie";
import qs from "qs";
import App from "./App";
import store from "./data/store";
import detectEthereumProvider from "@metamask/detect-provider";
import createWeb3 from "./utils/web3";
import Application from "./application";
import "./index.css";

const query = document.location.search.substring(1);
const params = qs.parse(query);

if (typeof params.provider === "undefined") {
  alert("Please provide a provider via the url query parameter 'provider'");
  throw new Error("No provider provided");
}

if (params.provider !== "metamask" && params.provider !== "raw-keys") {
  alert("Please provide a valid provider: 'metamask' or 'raw-keys'");
}

if (params.provider !== "metamask" && typeof params.account === "undefined") {
  alert(
    "Please provide an account (index) via the url query parameter 'account'"
  );
  throw new Error("No account provided");
}

// IF WE SWITCH FROM ONE METAMASK ACCOUNT TO ANOTHER, WE'D LOSE THE GAME STATE

const providerParam = params.provider as "metamask" | "raw-keys";
const accountIndex = providerParam === "raw-keys" ? Number(params.account) : 0;
let provider: any;

if (providerParam === "metamask") {
  provider = await detectEthereumProvider({ mustBeMetaMask: true });
} else {
  provider = import.meta.env.VITE_NODE_HTTP_URL;
}

const web3 = createWeb3(provider);
const app = new Application(web3, store, accountIndex, providerParam);

await app.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
