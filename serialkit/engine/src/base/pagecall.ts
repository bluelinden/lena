import * as SKPageTypes from "./page.types";
import { marked } from "marked";

export class GameStator {
	currentPage: SKPageTypes.SKPageOutput | undefined = undefined;
	inputValues: Record<string, string | number | boolean> = {};
	showPageValidationAlert = (text: string) => {
		alert(text);
	};
	private callDirectionalPage = (pageDirection: "next" | "prev") => {
		if (!this.currentPage) {
			alert(
				"Something really, really weird is happening. There is no current page set. - SerialKit Base Framework"
			);
		}
		const currentPage = this.currentPage;
		if (!currentPage?.reevaluatePageDecisions && currentPage?.passed) {
			switch (pageDirection) {
				case "next":
					this.currentPage = currentPage?.nextPage;
					break;
				case "prev":
					this.currentPage = currentPage?.prevPage;
					break;
			}
			return;
		}
		const pageOutput = this.currentPage?.on?.pageNext({
			event: {
				type: "nextPage",
			},
			inputValues: currentPage?.inputValues ?? {},
		});

		if (pageOutput) {
			// what type is pageOutput?
			switch (true) {
				// page output is a non action reason... aw man
				case typeof pageOutput.nonActionReason === "string":
					this.showPageValidationAlert(pageOutput.nonActionReason);
					break;
				// page output is a page!! yay!
				case !pageOutput.nonActionReason:
					if (currentPage) currentPage.nextPage = pageOutput;
					pageOutput.prevPage = currentPage;
					this.currentPage = pageOutput;
					break;
			}
		}
	};
}
