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
			<ChannelBadge channel={props.channel} />
			<ValuesAxis {...rest} />
			<div className={classNames(styles.gradient, {
				[styles.lightness]: props.channel === 'l',
				[styles.chroma]: props.channel === 'c',
				[styles.hue]: props.channel === 'h',
			})} />
			<ColorsGraph {...rest} />
		</div>
	)
}

function channelToString(channel: Channel) {
	switch (channel) {
		case 'l':
			return 'L'
		case 'c':
			return 'C'
		case 'h':
			return 'h'
	}
	return '0'
}

function ChannelBadge(props: { channel: Channel }) {
	return (
		<div className={styles.badge}>
			{channelToString(props.channel)}
		</div>
	)
}
