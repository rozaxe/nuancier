import React, { ReactElement, useState } from 'react'
import ColorsGraph from './ColorsGraph/ColorsGraph'

export default function App(): ReactElement {

	const [ colors, setColors ] = useState([
		{ l: 20, c: 20, h: 120 },
		{ l: 50, c: 50, h: 123 },
		{ l: 80, c: 20, h: 126 },
	])
    
	const handleChange = (i, val) => {
		const nextColor = { ...colors[i], l: val }
		const nextColors = [ ...colors ]
		nextColors[i] = nextColor
		setColors(nextColors)
	}

	return (
		<ColorsGraph
			colors={colors}
			channel={'l'}
			selected={0}
			onChange={handleChange}
		/>
	)
}
