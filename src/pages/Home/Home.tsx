import { faDownload, faFileImport, faInfo, faPalette, faSwatchbook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from "mobx-react";
import React, { ReactElement, useRef, useState } from "react";
import useInterfaceService from "../../services/InterfaceService";
import useStorageService from '../../services/StorageService';
import AboutDialog from '../AboutDialog/AboutDialog';
import ColorEdition from '../ColorEdition/ColorEdition';
import ColorsDiagramOfTint from "../ColorsDiagramOfTint/ColorsDiagramOfTint";
import ColorsDiagramOfTone from "../ColorsDiagramOfTone/ColorsDiagramOfTone";
import Palette from "../Palette/Palette";
import PaletteEditionDialog from '../PaletteEditionDialog/PaletteEditionDialog';

function Home(): ReactElement {
  const inputImportFile = useRef<any>(null) 
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)
  const storageService = useStorageService()
  const interfaceService = useInterfaceService()

  const handleOpenPaletteEditModal = () => {
    interfaceService.isPaletteEditModalOpen = true
  }

  const handleDownload = () => {
    storageService.export()
  }

  const handleImport = (e: any) => {
    const file = inputImportFile.current.files[0]
    if (!file) return
    storageService.import(file)
  }

  return (
    <>
      <div className="flex flex-row or-section or-theme--dark p-1 items-center">
        <div className="or-text font-bold">
          <FontAwesomeIcon icon={faSwatchbook} className="ml-1 mr-3" color="rgb(255, 165, 108)" />
          Nuancier
        </div>
        <div className="or-divider self-stretch mx-2" />
        <button className="or-button-sm" onClick={() => inputImportFile.current.click()}>
          <FontAwesomeIcon icon={faFileImport} className="mr-2" /> Import
        </button>
        <input type='file' ref={inputImportFile} style={{ display: 'none' }} onChange={handleImport} />
        <div className="flex-1" />
        <button className="or-button-sm--primary" onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export
        </button>
        <div className="or-divider self-stretch mx-2" />
        <button className="or-button-sm" onClick={() => setAboutDialogOpen(true)}>
          <FontAwesomeIcon icon={faInfo} />
        </button>
      </div>
      <div className="or-row">
        <div className="flex flex-col or-section or-theme--light-gray">
          <Palette />
          <button className="m-2 or-button" onClick={handleOpenPaletteEditModal}>
            <FontAwesomeIcon icon={faPalette} className="mr-2" />
            Edit palette
          </button>
        </div>
        <div className="flex-grow flex flex-col">
          <ColorEdition />
          <div className="or-divider--xl mx-0" />
          <div className="or-row flex-grow">
            <div className="mr-8" />
            <div className="flex-grow flex flex-col p-1">
              <ColorsDiagramOfTint className="app-diagram mb-4" channel="l" />
              <div className="my-1 app-divider" />
              <ColorsDiagramOfTint className="app-diagram mb-4" channel="c" />
              <div className="my-1 app-divider" />
              <ColorsDiagramOfTint className="app-diagram mb-4"channel="h" />
            </div>
            <div className="mr-8" />
            <div className="flex-grow flex flex-col p-1">
              <ColorsDiagramOfTone className="app-diagram mb-4" channel="l" />
              <div className="my-1 app-divider" />
              <ColorsDiagramOfTone className="app-diagram mb-4" channel="c" />
              <div className="my-1 app-divider" />
              <ColorsDiagramOfTone className="app-diagram mb-4" channel="h" />
            </div>
            <div className="mr-8" />
          </div>
        </div>
        <PaletteEditionDialog />
        <AboutDialog isOpen={aboutDialogOpen} onClose={() => setAboutDialogOpen(false)} />
      </div>
    </>
  );
}

export default observer(Home)
