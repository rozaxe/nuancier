import React from 'react'
import styles from './ValuesAxis.module.scss'

type ValuesAxisProps = {
	colors: Color[]
	channel: Channel
	onChange?: (index: any, value: any) => void
}

export default function ValuesAxis(props: ValuesAxisProps) {
	const handleChange = (delta: number, i: number) => {
		props.onChange?.(i, props.colors[i][props.channel] + delta)
	}

	return (
		<div className={styles.axis}>
			{props.colors.map((color, i) => (
				<div
					key={i}
					className={styles.value}
				>
					<div className={styles.float}>
						<div className={styles.action} onClick={() => handleChange(-0.5, i)}>-</div>
						<div className={styles.text}>{color[props.channel].toFixed(1)}</div>
						<div className={styles.action} onClick={() => handleChange(0.5, i)}>+</div>
					</div>
				</div>
			))}
		</div>
	)
}
