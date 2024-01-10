// page object goes here


import type { SKPageOutput } from "engine/base/page.types";
import { GameStator } from "engine/base/main";
import Intro from "./intro";


const game: SKPageOutput = {
	id: "initiation",

	get content() {
		return `Engineering and writing by blue linden.
	
Inspired by *Go Buy a Donut: The Compelling Experience* by Mayeda Alom.

Welcome to *Lena.*

**Warning:** This game is not intended for children, nor for anyone easily disturbed. It's not like I can stop you from playing it, but if you don't think you can handle it then please don't play it.`;
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

const stator = new GameStator(game);
export default stator;

