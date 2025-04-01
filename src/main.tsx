import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PathProvider } from "./utils/PathContext.tsx"; // 경로에 맞게 수정

import "./styles/css/index.css";
import "./styles/css/color.css";
import "./styles/css/font.css";
import "./styles/css/text.css";
import "./styles/css/utilities.css";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PathProvider>
        <App />
      </PathProvider>
    </BrowserRouter>
  </React.StrictMode>
);
