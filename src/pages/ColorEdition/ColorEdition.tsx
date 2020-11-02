import { observer } from "mobx-react";
import React, { ReactElement, useState, useEffect } from "react";
import { formatHex, converter } from 'culori'
import Input from "../Input/Input";
import usePaletteService from "../../services/PaletteService";
import useInterfaceService from "../../services/InterfaceService";

const lch = converter('lch')

type ColorEditionProps = {
    className?: string
}

function ColorEdition(props: ColorEditionProps): ReactElement {
    const paletteService = usePaletteService()
    const interfaceService = useInterfaceService()
    const [hexValue, setHexValue] = useState('')

    const swatch = paletteService.getSwatchByToneAndTint(interfaceService.toneSelected, interfaceService.tintSelected)

    useEffect(() => {
        setHexValue(
            formatHex({ ...swatch.color, mode: 'lch' })
                .replace('#', '')
        )
    }, [swatch.color, swatch.color.l, swatch.color.c, swatch.color.h])

    const handleChangeHex = (value: string) => {
        if (value.length === 6) {
            const color = lch(`#${value}`)
            paletteService.patchChannel(swatch.id, 'l', color.l ?? 0)
            paletteService.patchChannel(swatch.id, 'c', color.c ?? 0)
            paletteService.patchChannel(swatch.id, 'h', color.h ?? 0)
        }
        setHexValue(value)
    }

    function parseFloatOrZero(value: string): number {
        const parsed = Number.parseFloat(value)
        return isNaN(parsed) ? 0 : parsed
    }

    return (
        <div className={`${props.className} or-row p-1`}>
            <div className="or-group flex-grow">
                <Input
                    type="number"
                    placeholder="42"
                    leftElement={<>L</>}
                    value={`${swatch.color.l.toFixed(1)}`}
                    onChange={v => paletteService.patchChannel(swatch.id, 'l', parseFloatOrZero(v))}
                />
                <Input
                    type="number"
                    placeholder="42"
                    leftElement={<>C</>}
                    value={`${swatch.color.c.toFixed(1)}`}
                    onChange={v => paletteService.patchChannel(swatch.id, 'c', parseFloatOrZero(v))}
                />
                <Input
                    type="number"
                    placeholder="42"
                    leftElement={<>h</>}
                    value={`${swatch.color.h.toFixed(1)}`}
                    onChange={v => paletteService.patchChannel(swatch.id, 'h', parseFloatOrZero(v))}
                />
            </div>
            <Input
                className="uppercase flex-grow"
                placeholder="123ABC"
                leftElement={<>#</>}
                allows={/0123456789abcdef/i}
                format={/.{0,6}/}
                value={hexValue}
                onChange={handleChangeHex}
            />
        </div>
    )
}

export default observer(ColorEdition)
