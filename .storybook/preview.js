import React from 'react'
import './styles.css'

export const decorators = [
  (Story) => (
    <div className="or-app or-theme--light">
      <Story />
    </div>
  ),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
