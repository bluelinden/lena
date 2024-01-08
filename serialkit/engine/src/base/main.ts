import * as SKPageTypes from "./page.types";
import { marked } from "marked";

export class GameStator {
	constructor(page?: SKPageTypes.SKPageOutput) {
		if (page) {
			this.#currentPage = page;
		}
	}
	#currentPage: SKPageTypes.SKPageOutput = {
		content: `You've initialized SerialKit's base framework, at ${new Date().toLocaleTimeString()}, but no page has been loaded *yet.*`,
		on: {
			pageNext: () => {
				return {
					nonActionReason: "No next page set. This is the default page.",
				};
			},
			pagePrev: () => {
				return {
					nonActionReason:
						"No previous page set. This is the default page.",
				};
			},
			inputChange: (ev: SKPageTypes.SKEventData) => {
				switch (ev.inputValues["SerialKitDefault"]) {
					case "igmo":
						return {
							showNextButton: true,
							showPrevButton: false,
						};
					case "iwgb":
						return {
							showNextButton: false,
							showPrevButton: true,
						};
					case "icgew":
						return {
							showNextButton: true,
							showPrevButton: true,
						};
					default:
						return {
							showNextButton: false,
							showPrevButton: false,
						};
				}
			},
		},
		navOptions: {
			allowPrevPage: false,
			allowNextPage: false,
		},
		inputDef: {
			group: "SerialKitDefault",
			numbered: true,
			content: [
				{
					id: "opt1",
					value: "igmo",
					label: "I'm gonna move on.",
				},
				{
					id: "opt2",
					value: "iwgb",
					label: "I wanna go back!",
				},
				{
					id: "opt4",
					value: "icgew",
					label: "I could go either way.",
				},
				{
					id: "opt3",
					value: "nm",
					label: "I'm good here.",
				},
			],
		},
		titleMarker: "SerialKit",
	};
	get currentPage(): SKPageTypes.SKPageOutput {
		return this.#currentPage;
	}
	set currentPage(value: SKPageTypes.SKPageOutput) {
		this.#currentPage = value;
		if (this.#onPageChangeCallback) {
			this.#onPageChangeCallback(value);
		}
	}

	inputValues: Record<
		string,
		string | number | boolean | Record<string, boolean>
	> = {};

	showPageValidationAlert = (text: string) => {
		alert(text);
	};

	callInputChange = (
		group: string,
		value: string | number | boolean | Record<string, boolean>
	) => {
		const oldValue = this.inputValues[group];
		this.inputValues[group] = value;

		if (this.currentPage.inputValues) {
			this.currentPage.inputValues[group] = value;
		} else {
			this.currentPage.inputValues = {
				[group]: value,
			};
		}
		if (this.currentPage.on.inputChange) {
			const response = this.currentPage.on.inputChange({
				inputValues: this.inputValues,
				oldValue,
				event: {
					type: "inputChange",
					fieldName: group,
				},
			});
			if (response.showPrevButton !== undefined) {
				this.currentPage.navOptions.allowPrevPage = response.showPrevButton;
			}
			if (response.showNextButton !== undefined) {
				this.currentPage.navOptions.allowNextPage = response.showNextButton;
			}
		}
	};

	#onPageChangeCallback:
		| ((currentPage: SKPageTypes.SKPageOutput) => void)
		| undefined = undefined;

	onPageChange = (fn: (e: SKPageTypes.SKPageOutput) => void) => {
		this.#onPageChangeCallback = fn;
	};

	#callDirectionalPage = (pageDirection: "next" | "prev") => {
		if (!this.currentPage) {
			alert(
				"Something really, really weird is happening. There is no current page set. - SerialKit Base Framework"
			);
		}
		const currentPage = this.currentPage;
		if (!currentPage.reevaluatePageDecisions && currentPage.passed) {
			switch (pageDirection) {
				case "next":
					const nextPage = currentPage.nextPage;
					if (nextPage) this.currentPage = nextPage;
					break;
				case "prev":
					const prevPage = currentPage.prevPage;
					if (prevPage) this.currentPage = prevPage;
					break;
			}
			return;
		} else {
			const pageOutput = this.currentPage?.on[
				pageDirection === "next" ? "pageNext" : "pagePrev"
			]?.({
				event: {
					type: "nextPage",
				},
				inputValues: currentPage.inputValues ?? {},
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
		}
	};

	prevPage = () => {
		this.#callDirectionalPage("prev");
	};

	nextPage = () => {
		this.#callDirectionalPage("next");
	};
}
