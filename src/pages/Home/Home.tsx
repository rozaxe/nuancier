import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import useInterfaceService from "../../services/InterfaceService";
import ColorsDiagramOfTint from "../ColorsDiagramOfTint/ColorsDiagramOfTint";
import ColorsDiagramOfTone from "../ColorsDiagramOfTone/ColorsDiagramOfTone";
import Palette from "../Palette/Palette";
import PaletteEditionDialog from '../PaletteEditionDialog/PaletteEditionDialog';
import ColorEdition from '../ColorEdition/ColorEdition';

function Home(): ReactElement {
  const interfaceService = useInterfaceService()

  const handleOpenPaletteEditModal = () => {
    interfaceService.isPaletteEditModalOpen = true
  }

  return (
    <>
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
            <ColorsDiagramOfTint className="app-diagram"channel="h" />
          </div>
          <div className="mr-8" />
          <div className="flex-grow flex flex-col p-1">
            <ColorsDiagramOfTone className="app-diagram mb-4" channel="l" />
            <div className="my-1 app-divider" />
            <ColorsDiagramOfTone className="app-diagram mb-4" channel="c" />
            <div className="my-1 app-divider" />
            <ColorsDiagramOfTone className="app-diagram" channel="h" />
          </div>
          <div className="mr-8" />
        </div>
      </div>
      <PaletteEditionDialog />
    </>
  );
}

export default observer(Home)
