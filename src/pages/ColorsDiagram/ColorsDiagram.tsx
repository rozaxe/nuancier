import classNames from 'classnames'
import React, { ReactElement } from 'react'
import ColorsGraph from '../ColorsGraph/ColorsGraph'
import ValuesAxis from '../ValuesAxis/ValuesAxis'

import styles from './ColorsDiagram.module.scss'

type ColorsDiagramProps = {
	colors: Color[]
	onChange: (index: any, value: any) => void
	channel: Channel
	selected: number
	className?: string
}

export default function ColorsDiagram(props: ColorsDiagramProps): ReactElement {
	const { className, ...rest } = props
	return (
		<div className={classNames(styles.grid, className)}>
			<div /><ValuesAxis {...rest} />
			<div /><ColorsGraph {...rest} />
		</div>
	)
}
