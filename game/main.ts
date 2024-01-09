// page object goes here


import type { SKPageOutput } from "engine/base/page.types";
import Intro from "./intro";

const game: SKPageOutput = {
	get content() {
		return `Published by *blue linden software*.
	
Inspired by *The Donut Shop*.

Welcome to *Lena.*

**Warning:** This game is not intended for young children or anyone on unstable mental grounds. This game is designed to mess with you on a very deep level. If you can't handle that, please don't play it.`;
	},
	navOptions: {
		allowNextPage: true,
		allowPrevPage: false,
	},
	on: {
		pageNext: () => {
			return Intro;
		}
	},
	titleMarker: "Initiation",

};

export default game;
