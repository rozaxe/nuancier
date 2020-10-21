import React, { Component, createRef, FunctionComponent, RefObject } from 'react'
import classNames from 'classnames'
import { converter, formatHex } from 'culori'
import { scaleLinear } from 'd3-scale'
import _ from 'lodash'
import { withResizeDetector } from 'react-resize-detector'
import styles from './AnchorsPoint.module.scss'


type AnchorsPointProps = {
	colors: Color[]
	channel: Channel
	selected?: number
	onChange?: (index: any, value: any) => void
	className?: string
}

type ResizeProps = {
	width: number
	height: number
}

function domainFor(channel): [number, number] {
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

class AnchorsPoint extends Component<AnchorsPointProps & ResizeProps> {

	static defaultProps = {
		selected: -1,
		onChange: () => null,
	}

	containerRef: RefObject<HTMLDivElement> = createRef()
	containerRect: DOMRect
	handles: NodeListOf<HTMLDivElement>
	absoluteWidth: number
	absoluteHeight: number
	domainForChannel: [number, number]
	axisForChannel: any // d3-scale range

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.selectHandles()
	}

	componentDidUpdate(prevProps) {
		const { colors, channel, width, height } = this.props

		// Update range on channel or height change
		if (channel !== prevProps.channel || height !== prevProps.height) {
			this.domainForChannel = domainFor(channel)
			this.axisForChannel = scaleLinear()
				.domain(this.domainForChannel)
				.range([0, height])
		}

		// Reselect handles on colors length change
		if (colors.length !== prevProps.colors.length) {
			this.selectHandles()
		}

		// Reposition on resize
		if (width !== prevProps.width || height !== prevProps.height) {
			this.computeContainerSize()
			this.position()

		} else

		// Reposition on colors
		if (colors !== prevProps.colors) {
			this.position()
		}
	}

	computeContainerSize = () => {
		this.containerRect = this.containerRef.current.getBoundingClientRect()
		this.absoluteWidth = this.props.width
		this.absoluteHeight = this.props.height
	}

	selectHandles = () => {
		this.handles = this.containerRef.current.querySelectorAll('.handleArea')
	}

	position = () => {
		const subWidth = this.absoluteWidth / this.props.colors.length

		_.forEach(this.props.colors, (color, i) => {
			const x = i * subWidth + subWidth / 2
			const y = this.axisForChannel(color[this.props.channel])

			this.handles[i].style.left = `${x}px`
			this.handles[i].style.top = `${y}px`
		})
	}

	startMove = (event, index) => {
		const rect = event.target.getBoundingClientRect()
		const displacement = event.clientY - rect.top - rect.height / 2

		const handleMouseMove = event => {
			const y = event.clientY - this.containerRect.top - displacement
			const relative = 1 - y / this.containerRect.height
			const value = (this.domainForChannel[0] - this.domainForChannel[1]) * relative
			this.props.onChange(index, _.clamp(value, this.domainForChannel[1], this.domainForChannel[0]))
		}

		const handleMouseUp = () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	render() {
		return (
			<div className={classNames(styles.container, this.props.className)} ref={this.containerRef}>
				{this.props.colors.map((color, i) => (
					<div key={i} className={classNames('handleArea', styles.handleArea)} onMouseDown={event => this.startMove(event, i)}>
						<div className={classNames(styles.handle, { [styles.selected]: i === this.props.selected})} style={{ backgroundColor: toHex(color) }} />
					</div>
				))}
			</div>
		)
	}
}

export default withResizeDetector(AnchorsPoint) as FunctionComponent<AnchorsPointProps>
