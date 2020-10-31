
export function domainFor(channel: Channel): [number, number] {
	switch (channel) {
		case 'l':
			return [0, 100]
		case 'c':
			return [0, 100]
		case 'h':
			return [0, 360]
	}
}
