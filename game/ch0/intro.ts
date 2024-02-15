import * as SKPageTypes from "engine/base/page.types";
import SKStorage from "engine/storage";

const storage = SKStorage.open("introdata", false);
const tmpStorage = SKStorage.open("tmpdata", false, false);

export enum SKIntroVariables {
	introTrustMe = "intro-trust-me",
	hasBeenToldToGoBackToFirstPage = "has-been-told-to-go-back-to-first-page",
	hasGoneBackToFirstPage = "has-gone-back-to-first-page",
	justStartedGame = "just-started-game",
}

export const hi: SKPageTypes.SKPageFn = () => {
	return {
		id: "dm-hi",
		content: `Hey there, player! I'm the *narrator.* As you read through my book, I'll help you understand what's going on. I mean, without a narrator, there's no story, right? 
		
As you read, I'll guide you through what each character is feeling! I'll make sure you have the whole picture so you can understand and make informed decisions! I'll be your best friend!

${
	storage.get(SKIntroVariables.introTrustMe) ||
	storage.get(SKIntroVariables.hasGoneBackToFirstPage)
		? "And I would never, ever gaslight you!"
		: `Whenever you're ready, click "Next" to flip the page. See 'ya on the other side :)`
}`,
		transient: true,
		navOptions: {
			allowNextPage: true,
			allowPrevPage: false,
		},
		on: {
			pageNext: () => {
				return {
					id: "dm-explains",
				};
			},
		},
		titleMarker: "Hi!!!!!",
	};
};

export const explains: SKPageTypes.SKPageFn = () => {
	if (
		storage.get(SKIntroVariables.hasGoneBackToFirstPage) &&
		storage.get(SKIntroVariables.hasBeenToldToGoBackToFirstPage)
	) {
		storage.set(SKIntroVariables.introTrustMe, true);
	}
	storage.set(SKIntroVariables.hasBeenToldToGoBackToFirstPage, true);
	storage.commit();

	return {
		id: "dm-explains",
		transient: true,
		content: `Woah! You made it! Glad you caught up. For a second there I was scared you'd leave, hah.

I'm part of a project called "Making a Game That Gaslights You," but I'd never do such a thing! You're my favorite person!

${
	storage.get(SKIntroVariables.hasGoneBackToFirstPage)
		? `You trust me, right?
		
If so, welcome to *Lena.*`
		: `Could you go back to the last page for a sec...?`
}`,
		navOptions: {
			allowNextPage: storage.get(SKIntroVariables.introTrustMe) ? true : false,
			allowPrevPage: true,
		},
		titleMarker: "You made it!",
		on: {
			pagePrev: () => {
				storage.set(SKIntroVariables.hasGoneBackToFirstPage, true);
				return {
					id: "dm-hi",
				};
			},
			pageNext: () => {
				if (storage.get(SKIntroVariables.introTrustMe)) {
					tmpStorage.set(SKIntroVariables.justStartedGame, true);
					return {
						id: "initiation",
					};
				} else {
					return {
						id: "purgatory",
					};
				}
			}
		},
	};
};

export const purgatory: SKPageTypes.SKPageFn = () => {
	return {
		id: "purgatory",
		content: `Ah, I think there's something you forgot to do. Could you please re-read that last page?
`,
		transient: true,
		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		on: {
			pagePrev: () => {
				return {
					id: "$prev",
				};
			},
		},
		titleMarker: "...Oh?",
	};
}