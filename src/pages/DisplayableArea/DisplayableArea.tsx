// @ts-expect-error: Custom webpack loader for importing Web Worker
import DrawerWorker from 'workerize-loader!./worker'

import React, { Component, createRef, RefObject } from 'react'
import { withResizeDetector } from 'react-resize-detector'
import classNames from 'classnames'
import { debounce } from 'lodash-es'
import styles from './DisplayableArea.module.scss'

/**
 * @see https://github.com/d3/d3-contour
 */

type DisplayableAreaProps = {
	width: number
	height: number
	colors: Color[]
	channel: Channel
	className?: string
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

class DisplayableArea extends Component<DisplayableAreaProps> {

	canvasRef: RefObject<HTMLCanvasElement> = createRef()
	debounceDrawArea: () => void
	worker: any // Type of DrawerWorker
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
		const { colors, width, height } = this.props

		// Redraw on resize
		if (width !== prevProps.width || height !== prevProps.height) {
			this.absoluteWidth = width * (window.devicePixelRatio || 1)
			this.absoluteHeight = height * (window.devicePixelRatio || 1)

			this.canvasRef.current.style.width = `${width}px`
			this.canvasRef.current.style.height = `${height}px`
			this.canvasRef.current.width = this.absoluteWidth
			this.canvasRef.current.height = this.absoluteHeight

			this.debounceDrawArea()
		}

		// Redraw on colors changed
		if (colors !== prevProps.colors) {
			this.debounceDrawArea()
		}
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

		this.worker.terminate()
		this.worker = null

		const imageData = new ImageData(pixels, this.absoluteWidth, this.absoluteHeight)

		this.context2d.putImageData(imageData, 0, 0)
	}

	render() {
		return (
			<div className={styles.container}>
				<canvas ref={this.canvasRef} className={classNames(styles.content, this.props.className)} />
			</div>
		)
	}
}

export default withResizeDetector(DisplayableArea)
