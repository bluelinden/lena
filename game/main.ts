// page object goes here

import type { SKPageOutput, SKPageFn } from "engine/base/page.types";
import { GameStator } from "engine/base/main";
import * as menuPages from "./ch0/mainmenu";
import * as demoPages from "./ch0/intro";
import * as ch1Pages from "./ch1/action";
import SKStorage from "engine/storage";

// create the stator and hide the default page
const stator = new GameStator("Lena", false, true, true);

// register pages
stator.registerPage("initiation", menuPages.initiation);
stator.registerPage("welcome", menuPages.welcome);
stator.registerPage("dm-hi", demoPages.hi);
stator.registerPage("dm-explains", demoPages.explains);
stator.registerPage("purgatory", demoPages.purgatory);
stator.registerPage("ch1-first-alarm", ch1Pages.firstAlarm);
stator.registerPage("ch1-second-alarm", ch1Pages.secondAlarm);
stator.registerPage("ch1-third-alarm", ch1Pages.thirdAlarm);
stator.registerPage("ch1-initial-panic", ch1Pages.initialPanic);
stator.registerPage("ch1-panic-2", ch1Pages.panic2);
stator.registerPage("ch1-running-to-school", ch1Pages.runningToSchool);
stator.registerPage("ch1-spit-take", ch1Pages.spitTake);
stator.registerPage("ch1-the-girl", ch1Pages.theGirl);
stator.registerPage("ch1-allie", ch1Pages.allie);
stator.registerPage("ch1-teaser", ch1Pages.finalPage);

if (SKStorage.open(`gamesettings`).get("skip-intro")) {
	stator.callPage(SKStorage.open("sk-Lena").get("sk-most-recent-page"));
} else if (SKStorage.open(`gamedata`).get("has-started-game")) {
	// call the initiation page to start the game
	stator.callPage("initiation");
}
// call the demo page to introduce the player to the narrator
else stator.callPage("dm-hi");

export default stator;
