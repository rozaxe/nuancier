import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/App";
import { PaletteContext } from "./services/PaletteService";
import { StorageContext, StorageService } from "./services/StorageService";

ReactDOM.render(
  <React.StrictMode>
    <PaletteContext.Consumer>
      {paletteService => (
        <StorageContext.Provider value={new StorageService(paletteService)}>
          <App />
        </StorageContext.Provider>
      )}
    </PaletteContext.Consumer>
  </React.StrictMode>,
  document.getElementById("root")
);
