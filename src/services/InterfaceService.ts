import { createContext, useContext } from "react";
import { makeAutoObservable } from 'mobx';

export class InterfaceService {
    constructor() {
        makeAutoObservable(this, {})
    }

    private _tintSelected = '0'

    get tintSelected() {
        return this._tintSelected
    }

    set tintSelected(value: string) {
        this._tintSelected = value
    }

    private _toneSelected = '0'

    get toneSelected() {
        return this._toneSelected
    }

    set toneSelected(value: string) {
        this._toneSelected = value
    }

    private _isPaletteEditModalOpen = false

    get isPaletteEditModalOpen() {
        return this._isPaletteEditModalOpen
    }

    set isPaletteEditModalOpen(value: boolean) {
        this._isPaletteEditModalOpen = value
    }
}

export const InterfaceContext = createContext(new InterfaceService())

export default function useInterfaceService(): InterfaceService {
    return useContext(InterfaceContext) as unknown as InterfaceService
}
