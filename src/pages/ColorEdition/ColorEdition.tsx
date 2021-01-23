import { observer } from "mobx-react";
import React, { ReactElement, useState, useEffect } from "react";
import { formatHex, converter } from 'culori'
import _clamp from 'lodash/clamp'
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

    const [lightnessValue, setLightnessValue] = useState('' + swatch.color.l)
    const [chromaValue, setChromaValue] = useState('' + swatch.color.c)
    const [hueValue, setHueValue] = useState('' + swatch.color.c)

    useEffect(() => {
        setHexValue(
            formatHex({ ...swatch.color, mode: 'lch' })
                .replace('#', '')
        )
        setLightnessValue('' + swatch.color.l)
        setChromaValue('' + swatch.color.c)
        setHueValue('' + swatch.color.h)

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

    const handleChannelChange = (from: number, to: number, channel: Channel, value: string, setValue: any) => {
        const parsedValued = Number.parseFloat(value)
        if (!isNaN(parsedValued)) {
            const clampedValue = _clamp(parsedValued, from, to)
            paletteService.patchChannel(swatch.id, channel, clampedValue)
        }
        setValue(value)
    }

    return (
        <div className={`${props.className} or-row p-1`}>
            <div className="or-group flex-grow">
                <Input
                    type="number"
                    placeholder="42"
                    leftElement={<>L</>}
                    value={`${lightnessValue}`}
                    onChange={v => handleChannelChange(0, 100, 'l', v, setLightnessValue)}
                />
                <Input
                    type="number"
                    placeholder="42"
                    leftElement={<>C</>}
                    value={`${chromaValue}`}
                    onChange={v => handleChannelChange(0, 100, 'c', v, setChromaValue)}
                />
                <Input
                    type="number"
                    placeholder="42"
                    leftElement={<>h</>}
                    value={`${hueValue}`}
                    onChange={v => handleChannelChange(0, 360, 'h', v, setChromaValue)}
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
