import storage from "utils/storage";
import { randomChoice } from "utils/random-choice";
import type { SKPageOutput } from "engine/base/page.types";



const welcomePage: SKPageOutput = {
	id: "welcome",
	get content() {
		return `Similar to choose-your-own-adventure books, this game lets you choose how your character, Lena, acts. Simply pick the action you think she should take, and click the "next" button to turn the page.

Just be warned: you can't always make the same choice twice.`
	},

	inputDef: {
		group: "welcome",
		numbered: true,
		content: () => {
			return [
				{
					id: "play-game-welcome-btn",
					value: "play",
					label: "Play the game",
				},
				{
					id: "settings-welcome-btn",
					value: "settings",
					label: "Adjust player settings",
				},
				{
					id: "credits-welcome-btn",
					value: "credits",
					label: "View credits",

				}
			]
		}
	},

	

	on: {
		pagePrev: () => {
			return {
				id: "initiation",
			}
		},
		inputChange: (ev) => {
			switch (ev.inputValues["welcome"]) {
				case "play":
					return {
						showNextButton: true,
					}
				case "settings":
					return {
						showNextButton: true,
					}
				case "credits":
					return {
						showNextButton: true,
					}
				default:
					return {
						showNextButton: false,
					}
			}
		}
	},

	reevaluatePageDecisions: false,

	navOptions: {
		allowNextPage: false,
		allowPrevPage: true,
	},
	titleMarker: "Introduction",
}

export default welcomePage;