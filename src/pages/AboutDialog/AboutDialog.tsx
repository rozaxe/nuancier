import React, { ReactElement } from "react";
import Dialog from "../Dialog/Dialog";

type AboutDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AboutDialog(props: AboutDialogProps): ReactElement {
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      className="w-9/12g"
    >
      <div className="or-dialog__header">About Nuancier</div>
      <div className="or-column my-2">
        <div className="or-text">
          Made by <a className="text-ui-primary-rest underline" href="https://github.com/rozaxe">rozaxe</a>.
        </div>
        <div className="or-text">
          Source code is available on <a className="text-ui-primary-rest underline" href="https://github.com/rozaxe/nuancier">GitHub</a> (MIT).
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <button className="or-button" onClick={props.onClose}>
          Close
        </button>
      </div>
    </Dialog>
  )
}
