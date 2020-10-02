import { scaleLinear } from 'd3-scale'
import _ from 'lodash'
import { converter, displayable } from 'culori'

export function drawChart({
	width,
	height,
	from,
	to,
	steps,
	domainForChannel,
	channel
}) {
	const size = width * height * 4
	const subWidth = width / steps.length
	const domain = [from, ...steps, to]
	const pixels = new Uint8ClampedArray(size)

	const range = [0, ..._.map(steps, (v, i) => i * subWidth + subWidth / 2), width]

	const axisForChannel = scaleLinear()
		.domain(domainForChannel)
		.range([0, height])

	const transitionLightness = scaleLinear()
		.domain(domain.map(c => c.l))
		.range(range)

	const transitionChroma = scaleLinear()
		.domain(domain.map(c => c.c))
		.range(range)

	const transitionHue = scaleLinear()
		.domain(domain.map(c => c.h))
		.range(range)

	_.forEach(
		_.range(width),
		x => {
			const intermediateColor = {
				l: transitionLightness.invert(x),
				c: transitionChroma.invert(x),
				h: transitionHue.invert(x),
			}
			_.forEach(
				_.range(height),
				y => {
					const replacement = axisForChannel.invert(y)
					const color = {
						...intermediateColor,
						[channel]: replacement
					}
					const { r, g, b } = isDisplayable(color) ? { r: 255, g: 255, b: 255 } : { r: 230, g: 230, b: 230 }
					const displacement = y * width * 4 + x * 4
					pixels[displacement] = r
					pixels[displacement + 1] = g
					pixels[displacement + 2] = b
					pixels[displacement + 3] = 255
				}
			)
		}
	)

	return pixels
}

const lch = converter('lch')

function isDisplayable(color) {
	return displayable(lch(color))
}
