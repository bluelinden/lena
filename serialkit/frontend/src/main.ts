import "./app.scss";
import App from "./App.svelte";
import { GameStator } from "engine/main";

const app = new App({
	target: document.getElementById("app")!,
	props: {
		stator: new GameStator(),
	},
});

export default app;
