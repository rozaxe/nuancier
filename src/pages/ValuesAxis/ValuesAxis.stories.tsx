import React from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ValuesAxis from "./ValuesAxis"

export default {
	title: 'Values axis',
	component: ValuesAxis,
	argTypes: {
		channel: { control: { type: 'select', options: ['l', 'c', 'h'], } },
	},
} as Meta

const COLORS = [
	{ l: 20, c: 20, h: 120 },
	{ l: 50, c: 50, h: 123 },
	{ l: 80, c: 20, h: 126 },
]

const Template = (args) => <ValuesAxis {...args} />

export const Initial = Template.bind({})

Initial.args = {
	colors: COLORS,
	channel: 'l',
}
