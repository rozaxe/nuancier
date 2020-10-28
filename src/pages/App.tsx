import React, { ReactElement } from "react";
import Palette from "./Palette/Palette";
import ColorsDiagramOfTone from "./ColorsDiagramOfTone/ColorsDiagramOfTone";
import ColorsDiagramOfTint from "./ColorsDiagramOfTint/ColorsDiagramOfTint";

export default function App(): ReactElement {
  return (
    <div className="or-app or-theme--light flex flex-row">
      <Palette className="or-section or-theme--light-gray" />
      <div className="flex flex-col">
        <ColorsDiagramOfTint channel="l" />
        <ColorsDiagramOfTint channel="c" />
        <ColorsDiagramOfTint channel="h" />
      </div>
      <div className="flex flex-col">
        <ColorsDiagramOfTone channel="l" />
        <ColorsDiagramOfTone channel="c" />
        <ColorsDiagramOfTone channel="h" />
      </div>
    </div>
  );
}
