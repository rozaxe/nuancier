import classNames from 'classnames'
import React, { ReactElement, useState } from 'react'
import AnchorsPoint from '../AnchorsPoint/AnchorsPoint'
import DisplayableArea from '../DisplayableArea/DisplayableArea'

import styles from './ColorsGraph.module.scss'

type ColorsCurvesProps = {
	colors: Color[]
	onChange: (index: any, value: any) => void
	channel: Channel
	selected: number
	className?: string
}

export default function ColorsGraph(props: ColorsCurvesProps): ReactElement {
	const [isRedrawing, setIsRedrawing] = useState(false)
	return (
		<div className={classNames(styles.container, props.className)}>
			<DisplayableArea className={styles.graph} colors={props.colors} channel={props.channel} onStartDrawing={() => setIsRedrawing(true)} onDoneDrawing={() => setIsRedrawing(false)} />
			{ isRedrawing && <div className={classNames(styles.graph, styles.buffer)} /> }
			<AnchorsPoint className={styles.graph} colors={props.colors} onChange={props.onChange} channel={props.channel} selected={props.selected} />
		</div>
	)
}
