import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import _ from 'lodash'
import classNames from 'classnames'
import { converter, formatHex } from 'culori'

import styles from './AnchorsPoint.module.scss'

type ColorsCurvesProps = {
	colors: Color[]
	channel: Channel
	onSet: (index: any, value: any) => void
	selected: number
}

function domainFor(channel) {
	switch (channel) {
		case 'l':
			return [100, 0]
		case 'c':
			return [100, 0]
		case 'h':
			return [360, 0]
	}
	throw new Error('Wrong channel')
}

const lch = converter('lch')

function toHex(color: Color) {
	return formatHex(lch(color))
}

export default function ColorsCurves({ colors,
	channel,
	onSet,
	selected }: ColorsCurvesProps): ReactElement {

	const container = useRef<any>()
	const handles = useRef<any>()
	const containerRect = useRef<any>()
	const ratio = useRef(0)
	const width = useRef(0)
	const height = useRef(0)
	const domainForChannel = useRef<any>()
	const axisForChannel = useRef<any>()
	const count = useRef(colors.length)
	const colorsRef = useRef(colors)

	const drawForeground = () => {
		const subWidth = width.current / colors.length
	
		_.forEach(colors, (color, i) => {
			const x = i * subWidth + subWidth / 2
			const y = axisForChannel.current(color[channel])

			handles.current[i].style.left = `${x / ratio.current}px`
			handles.current[i].style.top = `${y / ratio.current}px`
		})
	}

	const computeContainerSize = () => {
		containerRect.current = container.current.getBoundingClientRect()
	}

	const draw = () => {
		drawForeground()
	}

	const selectHandles = () => {
		handles.current = container.current.querySelectorAll('.handleArea')
	}

	const containerRef = useCallback(async (node: HTMLDivElement) => {
		if (node == null) {
			return
		}

		container.current = node
		selectHandles()
		computeContainerSize()
		ratio.current = window.devicePixelRatio || 1
		width.current = node.clientWidth * ratio.current
		height.current = node.clientHeight * ratio.current

		domainForChannel.current = domainFor(channel)
		axisForChannel.current = scaleLinear()
			.domain(domainForChannel.current)
			.range([0, height.current])

	}, [channel])

	useEffect(() => {
		if (count.current !== colors.length) {
			count.current = colors.length
			selectHandles()
		}
		colorsRef.current = colors
		draw()

	}, [ colors ])

	const startMove = (event, index) => {
		computeContainerSize()

		const rect = event.target.getBoundingClientRect()
		const displacement = event.clientY - rect.top - rect.height / 2

		const handleMouseMove = event => {
			const y = event.clientY - containerRect.current.top - displacement
			const relative = 1 - y / containerRect.current.height
			const value = (domainForChannel.current[0] - domainForChannel.current[1]) * relative
			const domain = domainFor(channel)
			onSet(index, _.clamp(value, domain[1], domain[0]))
		}

		const handleMouseUp = () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	return (
		<div className={styles.container} ref={containerRef}>
			{colors.map((color, i) => (
				<div key={i} className={classNames('handleArea', styles.handleArea)} onMouseDown={event => startMove(event, i)}>
					<div className={classNames(styles.handle, { [styles.selected]: i === selected})} style={{ backgroundColor: toHex(color) }} />
				</div>
			))}
		</div>
	)
}
