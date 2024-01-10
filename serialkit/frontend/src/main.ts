import "./app.scss";
import App from "./App.svelte";
import GameStator from "../../../game/main";

const app = new App({
	target: document.getElementById("app")!,
	props: {
		stator: GameStator,
	},
});

export default app;
