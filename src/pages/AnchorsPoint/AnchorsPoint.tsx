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

	const [idle, setIdle] = useState(false)

	const container = useRef<any>()
	const handles = useRef<any>()
	const containerRect = useRef<any>()
	const ratio = useRef(0)
	const width = useRef(0)
	const height = useRef(0)
	const background = useRef<any>()
	const foreground = useRef<any>()
	const domainForChannel = useRef<any>()
	const axisForChannel = useRef<any>()
	const idleTimeout = useRef<any>()
	const count = useRef(colors.length)
	const colorsRef = useRef(colors)
	const paintOrder = useRef(0)

	const drawForeground = () => {
		foreground.current.clearRect(0, 0, width.current, height.current)
		const subWidth = width.current / colors.length

		_.forEach(colors, (color, i) => {
			const x = i * subWidth + subWidth / 2
			const y = axisForChannel.current(color[channel])
			const start = 0
			const end = 2 * Math.PI

			const outer = i === selected ? 8 : 6
			const inner = i === selected ? 6 : 4

			foreground.current.strokeStyle = '#848484'
			foreground.current.fillStyle = 'white'

			foreground.current.beginPath()
			foreground.current.arc(x, y, outer * ratio.current, start, end)
			foreground.current.stroke()
			foreground.current.fill()

			foreground.current.fillStyle = toHex(color)
			foreground.current.beginPath()
			foreground.current.arc(x, y, inner * ratio.current, start, end)
			foreground.current.fill()

			handles.current[i].style.left = `${x / ratio.current}px`
			handles.current[i].style.top = `${y / ratio.current}px`
		})
	}

	const applySizeOn = (element) => {
		element.style.width = `${container.current.clientWidth}px`
		element.style.height = `${container.current.clientHeight}px`
		element.width = width.current
		element.height = height.current
	}

	const computeContainerSize = () => {
		containerRect.current = container.current.getBoundingClientRect()
	}

	const draw = () => {
		drawForeground()
	}

	const selectHandles = () => {
		handles.current = container.current.querySelectorAll('.handle')
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

		const foregroundNode = node.querySelector('.foreground')  as HTMLCanvasElement
		foreground.current = foregroundNode.getContext('2d')

		applySizeOn(foregroundNode)

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
		setIdle(false)
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
		<div className={styles.content}>
			<div className='container' ref={containerRef}>
				<canvas className='canvas foreground' />
				{colors.map((_, i) => (
					<div key={i} className='handle' onMouseDown={event => startMove(event, i)} />
				))}
			</div>
		</div>
	)
}
