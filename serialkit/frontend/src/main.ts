import "./app.scss";
import App from "./App.svelte";
import { GameStator } from "engine/main";
import Game from "../../../game/main";

const app = new App({
	target: document.getElementById("app")!,
	props: {
		stator: new GameStator(Game ?? {}),
	},
});

export default app;
