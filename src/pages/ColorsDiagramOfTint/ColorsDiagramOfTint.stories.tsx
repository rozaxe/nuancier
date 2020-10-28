import React from 'react'
import ColorsDiagramOfTint from "./ColorsDiagramOfTint"

export default {
	title: 'Colors diagram (of tint)',
	component: ColorsDiagramOfTint
}

export const Initial = () => {
	return (
		<ColorsDiagramOfTint
			channel={'l'}
		/>
	)
}
