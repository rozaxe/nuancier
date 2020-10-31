declare type Color = {
	l: number,
	c: number,
	h: number
}

declare type Channel = 'l' | 'c' | 'h'

declare type Comparison = 'tone' | 'tine'

declare type Swatch = {
	id: string
	color: Color
	tintId: string
	toneId: string
}

declare type Tone = {
	id: string
	name: string
}

declare type Tint = {
	id: string
	name: string
}

declare type Link = {
	previous?: string
	next?: string
}

declare type LinkedTone = Tone & Link

declare type LinkedTint = Tint & Link
