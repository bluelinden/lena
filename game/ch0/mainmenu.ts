import type * as SKPageTypes from "engine/base/page.types";
import storage from "utils/storage";
import { randomChoice } from "utils/random-choice";

export const initiation: SKPageTypes.SKPageFn = () => {
	return {
		id: "initiation",

		content: `*Lena* is fun. But it's not for anyone under 13. I can't stop you from playing if you're too young, but I will warn you that this game is intended to mess with you and make you doubt your mental abilities. If you can't handle that, please close this tab.
		
If you're ready, click "Next" to begin your journey.

*Developed, designed and written by blue linden.*`,
		navOptions: {
			allowNextPage: true,
			allowPrevPage: false,
		},
		on: {
			pageNext: () => {
				return {
					id: "welcome",
				};
			},
		},
		titleMarker: "Initiation",
	};
};

export const welcome: SKPageTypes.SKPageFn = () => {
	return {
		id: "welcome",
		get content() {
			return `Similar to choose-your-own-adventure books, this game lets you choose how your character, Lena, acts. Simply pick the action you think she should take, and click the "next" button to turn the page.

Just be warned: you can't always make the same choice twice.`;
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
					},
				];
			},
		},

		on: {
			pagePrev: () => {
				return {
					id: "$prev",
				};
			},
			inputChange: (ev) => {
				switch (ev.inputValues["welcome"]) {
					case "play":
						return {
							showNextButton: true,
						};
					case "settings":
						return {
							showNextButton: true,
						};
					case "credits":
						return {
							showNextButton: true,
						};
					default:
						return {
							showNextButton: false,
						};
				}
			},
		},

		reevaluatePageDecisions: false,

		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		titleMarker: "Introduction",
	};
};
