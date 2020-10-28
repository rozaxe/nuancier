import React, { Fragment, ReactElement } from 'react'
import { observer } from 'mobx-react'
import { formatHex } from 'culori'
import styles from './Palette.module.scss'
import usePaletteService from '../../services/PaletteService'
import useInterfaceService from '../../services/InterfaceService'

type PaletteProps = {
    className?: string
}

function Palette({ className }: PaletteProps): ReactElement {
    const paletteService = usePaletteService()
    const interfaceService = useInterfaceService()
    const tones = paletteService.tones
    const tints = paletteService.tints
    const tintSelected = interfaceService.tintSelected
    const toneSelected = interfaceService.toneSelected

    const handleSwatchSelection = (swatch: Swatch) => {
        interfaceService.tintSelected = swatch.tintId
        interfaceService.toneSelected = swatch.toneId
    }

    return (
        <div
            className={`${className} ${styles.grid}`}
            style={{
                gridTemplateRows: `24px repeat(${tints.length}, 34px)`,
                gridTemplateColumns: `min-content repeat(${tones.length}, 34px)`
            }}
        >
            <div />
            {tones.map(tone => (
                <div
                    key={tone.id}
                    className={`${styles.toneName} ${toneSelected === tone.id ? styles.highlight : ''}`}
                >
                    {tone.name}
                </div>)
            )}
            {tints.map(tint => (
                <Fragment key={tint.id}>
                    <div
                        className={`${styles.tintName} ${tintSelected === tint.id ? styles.highlight : ''}`}
                    >
                        {tint.name}
                    </div>
                    {tones.map(tone => {
                        const swatch = paletteService.getSwatchByToneAndTint(tone.id, tint.id)
                        return (
                            <div
                                key={swatch.id}
                                className={styles.cell}
                                onClick={() => handleSwatchSelection(swatch)}
                            >
                                <div
                                    className={`${styles.swatch} ${tintSelected === swatch.tintId && toneSelected === swatch.toneId ? styles.highlight : ''}`}
                                    style={{
                                        backgroundColor: formatHex({ ...swatch.color, mode: 'lch' })
                                    }}
                                />
                            </div>
                        )
                    })}
                </Fragment>
            ))}
        </div>
    )
}

export default observer(Palette)
