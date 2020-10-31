// @ts-ignore Module not found
import DrawerWorker from 'workerize-loader!./worker' // eslint-disable-line import/no-webpack-loader-syntax

import React, { Component, createRef, FunctionComponent, RefObject } from 'react'
import { withResizeDetector } from 'react-resize-detector'
import classNames from 'classnames'
import { debounce } from 'lodash-es'
import styles from './DisplayableArea.module.scss'
import { domainFor } from '../../tools/lch'

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
	targetRef: RefObject<HTMLDivElement>
}

class DisplayableArea extends Component<DisplayableAreaProps & ResizeProps> {

	static defaultProps = {
		onStartDrawing: () => null,
		onDoneDrawing: () => null,
	}

	canvasRef: RefObject<HTMLCanvasElement> = createRef()
	worker: any // Type of DrawerWorker
	working: boolean = false
	context2d!: CanvasRenderingContext2D
	debounceDrawArea!: () => void
	absoluteWidth!: number
	absoluteHeight!: number

	componentDidMount() {
		this.debounceDrawArea = debounce(this.drawArea, 100, { trailing: true })
		this.context2d = this.canvasRef.current!.getContext('2d')!
	}

	componentDidUpdate(prevProps: DisplayableAreaProps & ResizeProps) {
		const { colors, channel, width, height } = this.props

		// Redraw on resize
		if (width !== prevProps.width || height !== prevProps.height) {
			this.absoluteWidth = Math.ceil(width * (window.devicePixelRatio || 1))
			this.absoluteHeight = Math.ceil(height * (window.devicePixelRatio || 1))

			this.canvasRef.current!.style.width = `${width}px`
			this.canvasRef.current!.style.height = `${height}px`
			this.canvasRef.current!.width = this.absoluteWidth
			this.canvasRef.current!.height = this.absoluteHeight

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
		this.props.onStartDrawing?.()
	}

	drawArea = async () => {
		if (this.worker != null) {
			this.worker.terminate()
		}

		this.worker = DrawerWorker()

		const head = this.props.colors[0] ?? { h: 0 }

		try {
			const pixels = await this.worker.drawChart({
				width: this.absoluteWidth,
				height: this.absoluteHeight,
				from: { l: 100, c: 0, h: head.h },
				to: { l : 0, c: 0, h: head.h },
				steps: this.props.colors,
				domainForChannel: [...domainFor(this.props.channel)].reverse() as [number, number],
				channel: this.props.channel,
			})
			
			const imageData = new ImageData(pixels, this.absoluteWidth, this.absoluteHeight)
			this.context2d.putImageData(imageData, 0, 0)
	
			this.worker.terminate()
			this.worker = null
			this.working = false
			this.props.onDoneDrawing?.()
		} catch (_) {}
	}

	render() {
		return (
			<div ref={this.props.targetRef} className={classNames(styles.container, this.props.className)}>
				<canvas ref={this.canvasRef} className={styles.content} />
			</div>
		)
	}
}

export default withResizeDetector(DisplayableArea) as FunctionComponent<DisplayableAreaProps>
