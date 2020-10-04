import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import AnchorsPoint from "./AnchorsPoint"

export default {
	title: 'Anchors point',
	component: AnchorsPoint,
	argTypes: {
		channel: { control: { type: 'select', options: ['l', 'c', 'h'], } },
	},
}

const COLORS = [
	{ l: 20, c: 20, h: 120 },
	{ l: 50, c: 50, h: 123 },
	{ l: 80, c: 20, h: 126 },
]

const Template = (args) => <AnchorsPoint {...args} />

export const Initial = Template.bind({})

Initial.args = {
	colors: COLORS,
	channel: 'l',
	onSet: action('set'),
	selected: 0
}
