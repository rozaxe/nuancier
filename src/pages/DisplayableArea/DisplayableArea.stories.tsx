import React, { useState } from 'react'
import DisplayableArea from "./DisplayableArea"

export default {
	title: 'Displayble area',
	component: DisplayableArea,
}

export const basic = () => {

	const [ colors ] = useState([
		{ l: 20, c: 20, h: 120 },
		{ l: 50, c: 50, h: 123 },
		{ l: 80, c: 20, h: 126 },
	])

	return (
		<DisplayableArea
			colors={colors}
			channel={'l'}
		/>
	)
}
