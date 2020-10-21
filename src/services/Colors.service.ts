import { makeAutoObservable } from "mobx"

class ColorsService {

	colors = {}

	constructor() {
		makeAutoObservable(this)
	}
}

export default new ColorsService()
