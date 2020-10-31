import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import useInterfaceService from "../../services/InterfaceService";
import Dialog from "../Dialog/Dialog";
import usePaletteService from "../../services/PaletteService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function PaletteEditionDialog() {
  const paletteService = usePaletteService()
  const interfaceService = useInterfaceService()

  const handleClosePaletteEditModal = () => {
    interfaceService.isPaletteEditModalOpen = false;
  }

  const handleNewTint = () => {
    paletteService.createTint()
  }

  const handleNewTone = () => {
    paletteService.createTone()
  }

  return (
    <Dialog
      isOpen={interfaceService.isPaletteEditModalOpen}
      onClose={handleClosePaletteEditModal}
      className="w-6/12g"
    >
      <div className="or-dialog__header">Edit palette</div>
      <div className="or-row">
          <div className="or-column flex-1 overflow-hidden">
            <div className="or-text">Tints</div>
            {paletteService.tints.map(tint => (
                <div key={tint.id} className="or-row">
                    <input
                        className="or-input"
                        placeholder="Tint name"
                        value={tint.name}
                        onChange={e => tint.name = e.target.value}
                    />
                    <button className="or-button--ghost" onClick={() => {
                        paletteService.deleteTint(tint.id)
                    }}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
            <button className="or-button--primary-outline" onClick={handleNewTint}>New tint</button>
          </div>
          <div className="or-column flex-1 overflow-hidden">
            <div className="or-text">Tones</div>
            {paletteService.tones.map(tone => (
                <div key={tone.id} className="or-row">
                    <input
                        className="or-input"
                        placeholder="Tone name"
                        value={tone.name}
                        onChange={e => tone.name = e.target.value}
                    />
                    <button className="or-button--ghost" onClick={() => {
                        paletteService.deleteTone(tone.id)
                    }}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>

                </div>
            ))}
            <button className="or-button--primary-outline" onClick={handleNewTone}>New tone</button>
          </div>
      </div>
      <div className="flex flex-row-reverse">
        <button className="or-button" onClick={handleClosePaletteEditModal}>
          Close
        </button>
      </div>
    </Dialog>
  )
}

export default observer(PaletteEditionDialog)
