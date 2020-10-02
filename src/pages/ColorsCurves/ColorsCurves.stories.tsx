import React, { useState } from 'react'
import ColorsCurves from "./ColorsCurves"

export default {
	title: 'Example/Colors Curves',
	component: ColorsCurves,
}

export const basic = () => {

	const [ colors, setColors ] = useState([
		{ l: 20, c: 20, h: 120 },
		{ l: 50, c: 50, h: 123 },
		{ l: 80, c: 20, h: 126 },
	])

	return (
		<ColorsCurves
			colors={colors}
			channel={'l'}
			onSet={
				(i, val) => {
					const nextColor = { ...colors[i], l: val }
					const nextColors = [ ...colors ]
					nextColors[i] = nextColor
					setColors(nextColors)
				}
			}
			selected={0}
		/>
	)
}
