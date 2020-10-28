import { createContext, useContext } from "react";
import { makeAutoObservable } from 'mobx';

export class InterfaceService {
    constructor() {
        makeAutoObservable(this, {})
    }

    private _tintSelected = 'b'

    get tintSelected() {
        return this._tintSelected
    }

    set tintSelected(value: string) {
        this._tintSelected = value
    }

    private _toneSelected = '500'

    get toneSelected() {
        return this._toneSelected
    }

    set toneSelected(value: string) {
        this._toneSelected = value
    }
}

export const InterfaceContext = createContext(new InterfaceService())

export default function useInterfaceService(): InterfaceService {
    return useContext(InterfaceContext) as unknown as InterfaceService
}
