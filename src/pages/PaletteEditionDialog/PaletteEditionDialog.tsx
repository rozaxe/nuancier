import { observer } from "mobx-react";
import React, { ReactElement } from "react";
import useInterfaceService from "../../services/InterfaceService";
import Dialog from "../Dialog/Dialog";
import usePaletteService from "../../services/PaletteService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowUp, faArrowDown, faPlus } from "@fortawesome/free-solid-svg-icons";

function PaletteEditionDialog(): ReactElement {
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

  const handleTintUp = (tint: Tint) => {
    paletteService.moveUpTint(tint.id)
  }

  const handleTintDown = (tint: Tint) => {
    paletteService.moveDownTint(tint.id)
  }

  const handleToneUp = (tone: Tone) => {
    paletteService.moveUpTone(tone.id)
  }

  const handleToneDown = (tone: Tone) => {
    paletteService.moveDownTone(tone.id)
  }


  return (
    <Dialog
      isOpen={interfaceService.isPaletteEditModalOpen}
      onClose={handleClosePaletteEditModal}
      className="w-9/12g"
    >
      <div className="or-dialog__header">Edit palette</div>
      <div className="or-row">
        <div className="or-section or-column or-theme--light-gray flex-1 overflow-hidden rounded m-1 p-1">
          <div className="or-text text-center font-bold">Tints</div>
          <div className="or-column mt-2 mb-4 flex-1">
            {paletteService.tints.map((tint, i) => (
              <div key={tint.id} className="or-row">
                <button
                  className={`${i === 0 ? 'opacity-0' : ''} or-button--ghost`}
                  disabled={i === 0}
                  onClick={() => handleTintUp(tint)}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button
                  className={`${i === (paletteService.tints.length - 1) ? 'opacity-0' : ''} or-button--ghost`}
                  disabled={i === (paletteService.tints.length - 1)}
                  onClick={() => handleTintDown(tint)}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
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
          </div>
          <button className="or-button--primary-outline" onClick={handleNewTint}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> New tint
          </button>
        </div>
        <div className="or-section or-column or-theme--light-gray flex-1 overflow-hidden rounded m-1 p-1">
          <div className="or-text text-center font-bold">Tones</div>
          <div className="or-column mt-2 mb-4 flex-1">
            {paletteService.tones.map((tone, i) => (
              <div key={tone.id} className="or-row">
                <button
                  className={`${i === 0 ? 'opacity-0' : ''} or-button--ghost`}
                  disabled={i === 0}
                  onClick={() => handleToneUp(tone)}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button
                  className={`${i === (paletteService.tones.length - 1) ? 'opacity-0' : ''} or-button--ghost`}
                  disabled={i === (paletteService.tones.length - 1)}
                  onClick={() => handleToneDown(tone)}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
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
          </div>
          <button className="or-button--primary-outline" onClick={handleNewTone}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> New tone
          </button>
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
