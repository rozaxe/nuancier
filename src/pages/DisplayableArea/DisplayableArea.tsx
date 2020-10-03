// @ts-expect-error: Custom webpack loader for importing Web Worker
import DrawerWorker from 'workerize-loader!./worker'

import React, { Component, createRef, FunctionComponent, RefObject } from 'react'
import { withResizeDetector } from 'react-resize-detector'
import classNames from 'classnames'
import { debounce } from 'lodash-es'
import styles from './DisplayableArea.module.scss'

/**
 * @see https://github.com/d3/d3-contour
 */

type DisplayableAreaProps = {
	colors: Color[]
	channel: Channel

	className?: string
	
	onStartDrawing?(): void
	onDoneDrawing?(): void
}

type ResizeProps = {
	width: number
	height: number
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

class DisplayableArea extends Component<DisplayableAreaProps & ResizeProps> {

	static defaultProps = {
		onStartDrawing: () => null,
		onDoneDrawing: () => null,
	}

	canvasRef: RefObject<HTMLCanvasElement> = createRef()
	debounceDrawArea: () => void
	worker: any // Type of DrawerWorker
	working: boolean = false
	context2d: CanvasRenderingContext2D
	absoluteWidth: number
	absoluteHeight: number

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.debounceDrawArea = debounce(this.drawArea, 100, { trailing: true })
		this.context2d = this.canvasRef.current.getContext('2d')
	}

	componentDidUpdate(prevProps) {
		const { colors, channel, width, height } = this.props

		// Redraw on resize
		if (width !== prevProps.width || height !== prevProps.height) {
			this.absoluteWidth = width * (window.devicePixelRatio || 1)
			this.absoluteHeight = height * (window.devicePixelRatio || 1)

			this.canvasRef.current.style.width = `${width}px`
			this.canvasRef.current.style.height = `${height}px`
			this.canvasRef.current.width = this.absoluteWidth
			this.canvasRef.current.height = this.absoluteHeight

			this.requestAreaDrawing()
		}

		// Redraw on colors or channel changed
		if (colors !== prevProps.colors || channel !== prevProps.channel) {
			this.requestAreaDrawing()
		}
	}

	requestAreaDrawing = () => {
		this.debounceDrawArea()
		if (this.working) return
		this.working = true
		this.props.onStartDrawing()
	}

	drawArea = async () => {
		if (this.worker != null) {
			this.worker.terminate()
		}

		this.worker = DrawerWorker()

		const head = this.props.colors[0] ?? { h: 0 }

		const pixels = await this.worker.drawChart({
			width: this.absoluteWidth,
			height: this.absoluteHeight,
			from: { l: 100, c: 0, h: head.h },
			to: { l : 0, c: 0, h: head.h },
			steps: this.props.colors,
			domainForChannel: domainFor(this.props.channel),
			channel: this.props.channel,
		})
		
		const imageData = new ImageData(pixels, this.absoluteWidth, this.absoluteHeight)
		this.context2d.putImageData(imageData, 0, 0)

		this.worker.terminate()
		this.worker = null
		this.working = false
		this.props.onDoneDrawing()
	}

	render() {
		return (
			<div className={styles.container}>
				<canvas ref={this.canvasRef} className={classNames(styles.content, this.props.className)} />
			</div>
		)
	}
}

export default withResizeDetector(DisplayableArea) as FunctionComponent<DisplayableAreaProps>
