import { createContext, useContext } from "react";
import { makeAutoObservable } from 'mobx';
import _find from 'lodash-es/find'
import _filter from 'lodash-es/filter'
import _values from 'lodash-es/values'
import _clamp from 'lodash-es/clamp'
import _round from 'lodash-es/round'
import _keyBy from 'lodash-es/keyBy'
import _forEach from 'lodash-es/forEach'
import _pickBy from 'lodash-es/pickBy'
import { v4 as uuidv4 } from 'uuid'
import { domainFor } from "../tools/lch";

export class PaletteService {
    constructor() {
        makeAutoObservable(this)
    }

    private _swatches: Record<string, Swatch> = {}

    private _tints: Record<string, LinkedTint> = {}    
    
    private _tones: Record<string, LinkedTone> = {}

    private _tintHead: string = ''

    private _toneHead: string = ''

    getSwatch = (id: string) => {
        return this._swatches[id]
    }

    patchChannel = (id: string, channel: Channel, value: number) => {
        this._swatches[id].color[channel] = _clamp(_round(value, 1), ...domainFor(channel))
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

    get swatches(): Swatch[] {
        return _values(this._swatches);
    }

    get tones(): Tone[] {
        const tones = []
        let head: LinkedTone | null = this._tones[this._toneHead]
        while (head != null) {
            tones.push(head)
            head = head.next ? this._tones[head.next] : null
        }
        return tones
    }

    get tints(): Tint[] {
        const tints = []
        let head: LinkedTint | null = this._tints[this._tintHead]
        while (head != null) {
            tints.push(head)
            head = head.next ? this._tints[head.next] : null
        }
        return tints
    }

    replaceAll = (swatches: Swatch[], tints: Tint[], tones: Tone[]) => {
        this._swatches = _keyBy(swatches, 'id')
        this._tones = _keyBy(tones, 'id')
        this._tints = _keyBy(tints, 'id')
        this._tintHead = tints[0]?.id
        this._toneHead = tones[0]?.id

        // Link tones
        for (let i = 0 ; i < tones.length - 1 ; ++i) {
            this._tones[tones[i].id].next = tones[i + 1].id
            this._tones[tones[i + 1].id].previous = tones[i].id
        }

        // Link tints
        for (let i = 0 ; i < tints.length - 1 ; ++i) {
            this._tints[tints[i].id].next = tints[i + 1].id
            this._tints[tints[i + 1].id].previous = tints[i].id
        }
    }

    createTint = () => {
        const tail = _find(this._tints, tint => tint.next == null)
        const tint: LinkedTint = {
            id: uuidv4(),
            name: 'New tint',
            previous: tail?.id
        }
        _forEach(this._tones, tone => this.createSwatch(tint, tone))
        if (tail) tail!.next = tint.id
        else this._tintHead = tint.id
        this._tints[tint.id] = tint
    }

    createTone = () => {
        const tail = _find(this._tones, tone => tone.next == null)
        const tone: LinkedTone = {
            id: uuidv4(),
            name: 'New tone',
            previous: tail?.id
        }
        _forEach(this._tints, tint => this.createSwatch(tint, tone))
        if (tail) tail!.next = tone.id
        else this._toneHead = tone.id
        this._tones[tone.id] = tone
    }

    private createSwatch = (tint: Tint, tone: Tone) => {
        const swatch: Swatch = {
            id: uuidv4(),
            tintId: tint.id,
            toneId: tone.id,
            color: {
                l: 88,
                c: 88,
                h: 44
            }
        }
        this._swatches[swatch.id] = swatch
    }

    deleteTint = (tintId: string) => {
        this._swatches = _pickBy(this._swatches, (swatch: Swatch) => swatch.tintId !== tintId)
        const tint = this._tints[tintId]
        if (tint.next) this._tints[tint.next].previous = tint.previous
        if (tint.previous) this._tints[tint.previous].next = tint.next
        else this._tintHead = tint.next ?? ''
    }

    deleteTone = (toneId: string) => {
        this._swatches = _pickBy(this._swatches, (swatch: Swatch) => swatch.tintId !== toneId)
        const tone = this._tones[toneId]
        if (tone.next) this._tones[tone.next].previous = tone.previous
        if (tone.previous) this._tones[tone.previous].next = tone.next
        else this._toneHead = tone.next ?? ''
    }

    moveUpTint = (tintId: string) => {
        this._moveUp(this._tints, tintId)
        if (this._tints[tintId].previous == null) this._tintHead = tintId
    }

    moveUpTone = (toneId: string) => {
        this._moveUp(this._tones, toneId)
        if (this._tones[toneId].previous == null) this._toneHead = toneId
    }

    _moveUp = (collections: any, id: string) => {
        const node = collections[id]
        const previous = collections[node.previous!]
        const next = collections[node.next!]
        if (!previous) return
        node.previous = previous.previous
        previous.next = node.next
        previous.previous = node.id
        if (!next) return
        next.previous = previous.id
    }

    _moveDown = (collections: any, id: string) => {
        const node = collections[id]
        const previous = collections[node.previous!]
        const next = collections[node.next!]
        if (!previous) return
        node.previous = previous.previous
        previous.next = node.next
        previous.previous = node.id
        if (!next) return
        next.previous = previous.id
    }
}

export const PaletteContext = createContext(new PaletteService())

export default function usePaletteService(): PaletteService {
    const paletteService = useContext(PaletteContext) as unknown as PaletteService
    return paletteService
}
