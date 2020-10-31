import React, { ReactElement, useEffect, useState } from "react";
import useInterfaceService from "../services/InterfaceService";
import usePaletteService from "../services/PaletteService";
import useStorageService from "../services/StorageService";
import { SWATCHES, TINTS, TONES } from "../tools/defaultPalette";
import './App.scss';
import Home from "./Home/Home";
import Spinner from "./Spinner/Spinner";

export default function App(): ReactElement {
  const storageService = useStorageService()
  const paletteService = usePaletteService()
  const interfaceService = useInterfaceService()

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Load or create palette
    if (storageService.hasStoredData()) {
      storageService.loadStoredData()
    } else {
      // Create default Palette
      paletteService.replaceAll(SWATCHES, TINTS, TONES)
    }

    // Set top left corner as selected
    interfaceService.tintSelected = paletteService.tints[0].id
    interfaceService.toneSelected = paletteService.tones[0].id

    // Set as initialized
    setInitialized(true)
  }, [storageService, paletteService, interfaceService])

  return (
    <div className="or-app or-theme--light flex flex-row">
      {initialized && <Home />}
      {!initialized && <Spinner className="m-2 align-self-start" />}
    </div>
  )
}
