import type * as SKPageTypes from "engine/base/page.types";
import SKStorage from "engine/storage";
import { randomChoice } from "utils/random-choice";
import { SKIntroVariables } from "game/ch0/intro";

const storage = SKStorage.open("gamedata", false);
const tmpStorage = SKStorage.open("tmpdata", false, false);

enum SKMenuVariables {
	numKids = "initiation-num-kids",
}

export const initiation: SKPageTypes.SKPageFn = () => {
	let numKids: number = storage.get(SKMenuVariables.numKids);
	if (!numKids) {
		numKids = Math.round(Math.random() * 3000);
		storage.set(SKMenuVariables.numKids, numKids);
		storage.commit();
	}

	let numMurderers = Math.ceil(numKids * 0.0005);

	let kidsReferenceTerm = "";
	switch (numMurderers) {
		case 1:
			kidsReferenceTerm = "";
			break;
		case 2:
			kidsReferenceTerm = "both ";
			break;
		case 3:
			kidsReferenceTerm = "all ";
	}

	let numFederalAgentsHurt = Math.ceil(numKids * 0.0005) * 5;

	let justStartedGame = tmpStorage.get(SKIntroVariables.justStartedGame);

	return {
		id: "initiation",
		transient: true,
		content: `${
			justStartedGame ? "Okay, so" : "It's me, the *narrator!*"
		} I'd just like to let you know that this book, while technically appropriate for kids, is not intended for them or really anyone under 12 years old. This book is classified as *psychological horror* and it won't do good things to the psyches of children. About half of the kids I tested this book on ended up in jail for assault and battery, along with a few first-degree murders. They're in the minority, though. With a sample size of ${numKids.toLocaleString()} kids, and an assumed initial murderous percentage of them being around 0.05%, the murderous child rate only increased from ${Math.ceil(
			numKids * 0.0005
		).toLocaleString()} in every ${numKids.toLocaleString()} kids to ${(
			Math.round(numKids / 1.7) + 1
		).toLocaleString()} in ${Math.round(
			numKids - numMurderers
		).toLocaleString()}. We had to remove ${numMurderers === 1 ? "that" : "those"} ${Math.ceil(
			numMurderers
		).toLocaleString()} ${numMurderers === 1 ? "kid" : "kids"} from the sample so the feds could handle them. I think they only managed to kill ${(
			Math.ceil(numMurderers) * 5
		).toLocaleString()} agents before they were ${kidsReferenceTerm}contained.`,
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
		transient: true,
		content: `This book lets you choose how your character, Lena, acts. Simply pick the action you think she should take, and click the "next" button to turn the page.

${
	hasStartedGame
		? `Are you ready to play again? You say, `
		: `Just be warned: you can't always make the same choice twice. To that, you say,`
}`,

		inputDef: {
			group: "welcome",
			numbered: true,
			persistent: true,
			content: [
				{
					id: "play-game-welcome-btn",
					value: "play",
					label: hasStartedGame
						? `"I'm ready. Let's play."`
						: `"Fine by me, I'm ready."`,
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
						let mostRecentPage = SKStorage.open("sk-Lena").get(
							"sk-most-recent-page"
						);
						if (mostRecentPage) {
							return {
								id: mostRecentPage,
							};
						}
						return {
							id: "ch1-first-alarm",
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
