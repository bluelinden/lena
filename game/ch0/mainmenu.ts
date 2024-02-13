import type * as SKPageTypes from "engine/base/page.types";
import SKStorage from "engine/storage";
import { randomChoice } from "utils/random-choice";

const storage = SKStorage.open("gamedata", true);

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
	const hasStartedGame = storage.get("has-started-game");
	return {
		id: "welcome",
		content: `Similar to choose-your-own-adventure books, this game lets you choose how your character, Lena, acts. Simply pick the action you think she should take, and click the "next" button to turn the page.

${
	hasStartedGame
		? `Are you ready to play again? You say, `
		: `Just be warned: you can't always make the same choice twice. To that, you say,`
}`,

		inputDef: {
			group: "welcome",
			numbered: true,
			content: [
				{
					id: "play-game-welcome-btn",
					value: "play",
					label: hasStartedGame ? `"I'm ready. Let's play."` : `"Fine by me, I'm ready."`,
				},
				{
					id: "settings-welcome-btn",
					value: "settings",
					label: `"I'd like to adjust my player settings."`,
				},
				{
					id: "credits-welcome-btn",
					value: "credits",
					label: `"Who made this game?"`,
				},
			],
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
			pageNext: (ev: SKPageTypes.SKEventData) => {
				switch (ev.inputValues["welcome"]) {
					case "play":
						storage.set("has-started-game", true);
						storage.commit();
						return {
							id: "ch1-wakeup-action",
						} as SKPageTypes.SKPageRef;
					case "settings":
						return {
							id: "player-settings",
						};
					default:
						return {
							nonActionReason:
								"You've picked an option that doesn't allow for a next page.",
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
