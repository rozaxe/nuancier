import { createContext, useContext } from "react";
import { makeAutoObservable } from 'mobx';
import _find from 'lodash-es/find'
import _filter from 'lodash-es/filter'
import _values from 'lodash-es/values'

export class PaletteService {
    constructor() {
        makeAutoObservable(this, {})
    }

    private _swatches: Record<string, Swatch> = {
        'red-400': { id: 'red-400', toneId: '400', tintId: 'a', color: { l: 50, c: 0, h: 0 } },
        'red-500': { id: 'red-500', toneId: '500', tintId: 'a', color: { l: 50, c: 0, h: 0 } },
        'red-600': { id: 'red-600', toneId: '600', tintId: 'a', color: { l: 50, c: 0, h: 0 } },

        'green-400': { id: 'green-400', toneId: '400', tintId: 'b', color: { l: 50, c: 0, h: 0 } },
        'green-500': { id: 'green-500', toneId: '500', tintId: 'b', color: { l: 50, c: 0, h: 0 } },
        'green-600': { id: 'green-600', toneId: '600', tintId: 'b', color: { l: 50, c: 0, h: 0 } },

        'blue-400': { id: 'blue-400', toneId: '400', tintId: 'c', color: { l: 50, c: 0, h: 0 } },
        'blue-500': { id: 'blue-500', toneId: '500', tintId: 'c', color: { l: 50, c: 0, h: 0 } },
        'blue-600': { id: 'blue-600', toneId: '600', tintId: 'c', color: { l: 50, c: 0, h: 0 } },
    }

    private _tints: Record<string, Tint> = {
        'a': { id: 'a', name: 'red' },
        'b': { id: 'b', name: 'green' },
        'c': { id: 'c', name: 'blue' },
    }

    private _tones: Record<string, Tone> = {
        '400': { id: '400', name: '400' },
        '500': { id: '500', name: '500' },
        '600': { id: '600', name: '600' },
    }

    getSwatch = (id: string) => {
        return this._swatches[id]
    }

    patchChannel = (id: string, channel: Channel, value: number) => {
        this._swatches[id].color[channel] = value
    }

    getSwatches = (ids: string[]): Swatch[] => {
        return ids.map(id => this._swatches[id])
    }

    getSwatchesByTone = (toneId: string): Swatch[] => {
        return _filter(this._swatches, (swatch) => swatch.toneId === toneId)
    }

    getSwatchesByTint = (tintId: string): Swatch[] => {
        return _filter(this._swatches, (swatch) => swatch.tintId === tintId)
    }

    getSwatchByToneAndTint = (toneId: string, tintId: string): Swatch => {
        return _find(this._swatches, (swatch) => swatch.toneId === toneId && swatch.tintId === tintId) as Swatch
    }

    get tones(): Tone[] {
        return _values(this._tones);
    }

    get tints(): Tint[] {
        return _values(this._tints);
    }
}

export const PaletteContext = createContext(new PaletteService())

export default function usePaletteService(): PaletteService {
    const paletteService = useContext(PaletteContext) as unknown as PaletteService
    return paletteService
}
