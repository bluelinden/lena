// page object goes here

import type { SKPageOutput, SKPageFn } from "engine/base/page.types";
import { GameStator } from "engine/base/main";
import * as menuPages from "./ch0/mainmenu";

// create the stator and hide the default page
const stator = new GameStator(false, true);

// register pages
stator.registerPage("initiation", menuPages.initiation);
stator.registerPage("welcome", menuPages.welcome);

// call the initiation page to start the game
stator.callPage("initiation");
export default stator;
