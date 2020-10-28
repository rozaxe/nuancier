import { observer } from 'mobx-react'
import React, { ReactElement } from 'react'
import useInterfaceService from '../../services/InterfaceService'
import usePaletteService from '../../services/PaletteService'
import ColorsDiagram from '../ColorsDiagram/ColorsDiagram'
import { toJS } from 'mobx'

type ColorsDiagramOfTintProps = {
	channel: Channel
	className?: string
}

function ColorsDiagramOfTint({ channel, className }: ColorsDiagramOfTintProps): ReactElement {
    const paletteService = usePaletteService()
    const interfaceService = useInterfaceService()

    const swatches = paletteService.getSwatchesByTint(interfaceService.tintSelected)
    const selected = swatches.findIndex(swatch => swatch.toneId === interfaceService.toneSelected)

    const handleChange = (index: number, value: number) => {
        const swatch = swatches[index]
        paletteService.patchChannel(swatch.id, channel, value)
    }

	return (
        <ColorsDiagram
            channel={channel}
            colors={swatches.map(swatch => toJS(swatch.color))}
            onChange={handleChange}
            selected={selected}
            className={className}
        /> 
	)
}

export default observer(ColorsDiagramOfTint)
