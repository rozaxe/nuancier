import { createContext, useContext } from "react";
import { autorun, toJS } from "mobx";
import { saveAs } from 'file-saver'
import { PaletteService } from "./PaletteService";
import _pick from 'lodash-es/pick'

export class StorageService {
    private paletteService: PaletteService
    private firstReactionSkiped = false

    constructor(paletteService: PaletteService) {
        this.paletteService = paletteService
        this.saveOnChange()
    }

    private saveOnChange = () => {
        autorun(() => {
            const swatches = toJS(this.paletteService.swatches)
            const tones = toJS(this.paletteService.tones)
            const tints = toJS(this.paletteService.tints)

            // Skip first reaction detection
            if (!this.firstReactionSkiped) {
                this.firstReactionSkiped = true
                return
            }

            // Save content
            const content = this.sanitize(swatches, tones, tints)
            localStorage.setItem('swatches', JSON.stringify(content.swatches))
            localStorage.setItem('tones', JSON.stringify(content.tones))
            localStorage.setItem('tints', JSON.stringify(content.tints))
        })
    }

    private sanitize = (swatches: any, tones: any, tints: any) => {
        return {
            swatches: swatches.map(
                (swatch: any) => _pick(swatch, ['id', 'color', 'tintId', 'toneId'])
            ),
            tones: tones.map(
                (tone: any) => _pick(tone, ['id', 'name'])
            ),
            tints: tints.map(
                (tint: any) => _pick(tint, ['id', 'name'])
            )
        }
    }

    hasStoredData = (): boolean => {
        return localStorage.getItem('swatches') != null
            && localStorage.getItem('tones') != null
            && localStorage.getItem('tints') != null
    }

    loadStoredData = () => {
        this.paletteService.replaceAll(
            JSON.parse(localStorage.getItem('swatches')!),
            JSON.parse(localStorage.getItem('tints')!),
            JSON.parse(localStorage.getItem('tones')!)
        )
    }

    export = () => {
        const content = this.sanitize(
            toJS(this.paletteService.swatches),
            toJS(this.paletteService.tones),
            toJS(this.paletteService.tints)
        )
        const blob = new Blob([JSON.stringify(content, null, 2)], {type: "application/json;charset=utf-8"})
        saveAs(blob, 'swatches.json')
    }

    import = (file: File) => {
        const reader = new FileReader()
        reader.onload = (event: any) => {
            try {
                const content = JSON.parse(event.target.result)
                this.paletteService.replaceAll(
                    content.swatches,
                    content.tints,
                    content.tones,
                )
            } catch (error) {
                throw new Error("Cannot load file")    
            }
        }
        reader.onerror = (error: any) => {
            throw new Error("Cannot parse file")
        }
        reader.readAsText(file)
    }
}

export const StorageContext = createContext<StorageService>(null as any)

export default function useStorageService(): StorageService {
    return useContext(StorageContext) as any
}
