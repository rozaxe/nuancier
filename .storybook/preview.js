import React from 'react'
import { PaletteService, PaletteContext } from '../src/services/PaletteService'
import { InterfaceService, InterfaceContext } from '../src/services/InterfaceService'
import './styles.css'

export const decorators = [
  (Story) => (
    <div className="or-app or-theme--light">
      <PaletteContext.Provider value={new PaletteService()}>
        <InterfaceContext.Provider value={new InterfaceService()}>
          <Story />
        </InterfaceContext.Provider>
      </PaletteContext.Provider>
    </div>
  ),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
