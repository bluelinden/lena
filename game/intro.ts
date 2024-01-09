import storage from "utils/storage";
import { randomChoice } from "utils/random-choice";
import type { SKPageOutput } from "engine/base/page.types";



const intro: SKPageOutput = {
	get content() {
		return `Welcome to *Lena*! Glad you could make it.`
	},

	on: {
		
	},

	reevaluatePageDecisions: false,

	navOptions: {
		allowNextPage: true,
		allowPrevPage: true,
	},
	titleMarker: "Introduction",
}

export default intro;