import React from 'react'
import ColorsDiagramOfTone from "./ColorsDiagramOfTone"

export default {
	title: 'Colors diagram (of tone)',
	component: ColorsDiagramOfTone
}

export const Initial = () => {
	return (
		<ColorsDiagramOfTone
			channel={'l'}
		/>
	)
}
