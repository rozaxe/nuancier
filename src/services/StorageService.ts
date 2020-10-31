import { createContext, useContext } from "react";
import { autorun, toJS } from "mobx";
import { PaletteService } from "./PaletteService";

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
            localStorage.setItem('swatches', JSON.stringify(swatches))
            localStorage.setItem('tones', JSON.stringify(tones))
            localStorage.setItem('tints', JSON.stringify(tints))
        })
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
}

export const StorageContext = createContext<StorageService>(null as any)

export default function useStorageService(): StorageService {
    return useContext(StorageContext) as any
}
