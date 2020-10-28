import { observer } from 'mobx-react'
import React, { ReactElement } from 'react'
import useInterfaceService from '../../services/InterfaceService'
import usePaletteService from '../../services/PaletteService'
import ColorsDiagram from '../ColorsDiagram/ColorsDiagram'
import { toJS } from 'mobx'

type ColorsDiagramOfToneProps = {
	channel: Channel
	className?: string
}

function ColorsDiagramOfTone({ channel, className }: ColorsDiagramOfToneProps): ReactElement {
    const paletteService = usePaletteService()
    const interfaceService = useInterfaceService()

    const swatches = paletteService.getSwatchesByTone(interfaceService.toneSelected)
    const selected = swatches.findIndex(swatch => swatch.tintId === interfaceService.tintSelected)

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

export default observer(ColorsDiagramOfTone)
