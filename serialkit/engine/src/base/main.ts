import * as SKPageTypes from "./page.types";
import { marked } from "marked";
import SKStorage from "../storage";
import storage from "../storage";

export class GameStator {
	constructor(
		public gameName = "game",
		public showDefaultPage = false,
		public debug = false,
		private persistent = false
	) {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "load",
				isError: false,
				message: `Initializing SerialKit Game Stator.`,
			},
		});
		SKStorage.onDebugMessage((message, messageArray) => {
			this.#debugMessage(message);
		});
		this.#debugMessage({
			type: "debug",
			data: {
				category: "load",
				isError: false,
				message: `Initialized SerialKit Game Stator.`,
			},
		});
	}
	#pages: Record<string, SKPageTypes.SKPageFn> = {};
	#debugMessageArray: SKPageTypes.SKDebugMessage[] = [];
	#currentPage: SKPageTypes.SKPageOutput = {
		id: "sk_default",
		content: `You've initialized SerialKit's base framework, at ${new Date().toLocaleTimeString()}, but no page has been loaded *yet.*
		
This version of SerialKit is designed specifically to be used in the game *Lena.*`,
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
		titleMarker: "LenaKit",
	};
	get currentPage(): SKPageTypes.SKPageOutput {
		if (!this.showDefaultPage && this.#currentPage.id === "sk_default") {
			this.#debugMessage({
				type: "debug",
				data: {
					category: "load",
					isError: false,
					message: `Skipping default page.`,
				},
			});
			return {
				id: "sk_blank",
				content: "",
				on: {},
				navOptions: {
					allowNextPage: false,
					allowPrevPage: false,
				},
				titleMarker: "",
			};
		}
		return this.#currentPage;
	}
	set currentPage(newPage: SKPageTypes.SKPageOutput) {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "load",
				isError: false,
				message: `Inserting page "${newPage.id}"`,
			},
		});
		this.#currentPage = newPage;
		// disable SerialKit's built-in automatic registration of pages
		// if (newPage.titleMarker) {
		// 	this.registerPage(newPage.id, newPage);
		// }last-viewed-page
		if (this.persistent && !newPage.transient) {
			const storage = SKStorage.open(`sk-${this.gameName}`, true);
			storage.set("sk-most-recent-page", newPage.id);
			storage.commit();
		}

		if (newPage.inputDef?.persistent) {
			this.#debugMessage({
				type: "debug",
				data: {
					category: "input",
					isError: false,
					message: `Checking storage for persistent input group ${newPage.inputDef.group}`,
				},
			});
			const inputValue = SKStorage.open(`sk-${this.gameName}-input`).get(
				newPage.inputDef.group
			);
			if (inputValue) {
				this.inputValues.set(newPage.inputDef.group, inputValue);
				this.callInputChange(newPage.inputDef.group, inputValue);

				this.#debugMessage({
					type: "debug",
					data: {
						category: "input",
						isError: false,
						message: `Found and set persistent input group ${newPage.inputDef.group}, with value ${inputValue}`,
					},
				});
			}
		}

		if (this.#onPageChangeCallback) {
			this.#debugMessage({
				type: "debug",
				data: {
					category: "load",
					isError: false,
					message: `Calling frontend page change callback`,
				},
			});
			this.#onPageChangeCallback(newPage);
		}
	}

	callPage = (pageId: string, usePersistence = true) => {
		if (this.#pages[pageId]) {
			const priorPersistentValue = this.persistent;
			if (!usePersistence) {
				this.persistent = false;
			}
			this.currentPage = this.#pages[pageId]();
			if (!usePersistence) {
				this.persistent = priorPersistentValue;
			}
		}
	};

	inputValues: Map<
		string,
		string | number | boolean | Record<string, boolean>
	> = new Map();

	showPageValidationAlert = (text: string) => {
		alert(text);
	};

	callInputChange = (
		group: string,
		value: string | number | boolean | Record<string, boolean>
	) => {
		const oldValue = this.inputValues.get(group);
		this.inputValues.set(group, value);

		this.#debugMessage({
			type: "debug",
			data: {
				category: "input",
				isError: false,
				message: `Input change: ${group} = ${value}`,
			},
		});
		if (this.currentPage.on.inputChange) {
			this.#debugMessage({
				type: "debug",
				data: {
					category: "input",
					isError: false,
					message: `Calling input change callback`,
				},
			});
			const response = this.currentPage.on.inputChange({
				inputValues: Object.fromEntries(this.inputValues),
				oldValue,
				event: {
					type: "inputChange",
					fieldName: group,
				},
			});
			this.#debugMessage({
				type: "debug",
				data: {
					category: "input",
					isError: false,
					message: `Input change callback response: ${JSON.stringify(
						response
					)}`,
				},
			});
			if (response.showPrevButton !== undefined) {
				this.currentPage.navOptions.allowPrevPage = response.showPrevButton;
			}
			if (response.showNextButton !== undefined) {
				this.currentPage.navOptions.allowNextPage = response.showNextButton;
			}
		}
		if (this.currentPage.inputDef?.persistent) {
			let inputStorage = storage.open(
				`sk-${this.gameName}-input`,
				false,
				true
			);

			inputStorage.set(group, value);
			inputStorage.commit();

			this.#debugMessage({
				type: "debug",
				data: {
					category: "input",
					isError: false,
					message: `Persisted input change: ${group} = ${value}`,
				},
			})
		}
	};

	#onPageChangeCallback:
		| ((currentPage: SKPageTypes.SKPageOutput) => void)
		| undefined = undefined;

	onPageChange = (fn: (e: SKPageTypes.SKPageOutput) => void) => {
		this.#onPageChangeCallback = fn;
	};

	#debugCallback:
		| ((
				message: SKPageTypes.SKDebugMessage,
				messageArray: SKPageTypes.SKDebugMessage[]
		  ) => void)
		| undefined = undefined;

	onDebugMessage = (
		fn: (
			message: SKPageTypes.SKDebugMessage,
			messageArray: SKPageTypes.SKDebugMessage[]
		) => void
	) => {
		if (this.debug) {
			this.#debugCallback = fn;
			this.#debugMessage({
				type: "debug",
				data: {
					category: "meta",
					isError: false,
					message: `Initializing debug UI.`,
					isInternal: true,
				},
			});
		}
	};

	#debugMessage = (message: SKPageTypes.SKDebugMessage) => {
		this.#debugMessageArray.push(message);
		if (this.#debugCallback) {
			this.#debugCallback(message, this.#debugMessageArray);
		}
	};

	externalDebugMessage = (message: SKPageTypes.SKDebugMessage) => {
		this.#debugMessage(message);
	};

	#callDirectionalPage = (pageDirection: "next" | "prev") => {
		this.#debugMessage({
			type: "debug",
			data: {
				message: `------- START PAGE LOAD -------`,
				isError: false,
				category: "meta",
			},
		});
		// step one - check if there even is a current page
		if (!this.currentPage) {
			this.#debugMessage({
				type: "debug",
				data: {
					message: `No current page... What?`,
					isError: true,
					category: "load",
				},
			});
			return;
		}
		const currentPage = this.currentPage;

		// step two - check if the current page has been evaluated

		// if the current page has already been evaluated and passed, just take the shortcut.

		// step three - check if the current page has a next or previous page.
		this.#debugMessage({
			type: "debug",
			data: {
				message: `Calling ${pageDirection} page handler with input values: ${JSON.stringify(
					Object.fromEntries(this.inputValues)
				)}`,
				isError: false,
				category: "load",
			},
		});
		const pageOutput = this.currentPage?.on[
			pageDirection === "next" ? "pageNext" : "pagePrev"
		]?.({
			event: {
				type: "nextPage",
			},
			inputValues: Object.fromEntries(this.inputValues) ?? {},
		});
		this.#debugMessage({
			type: "debug",
			data: {
				message: `Page handler response: ${JSON.stringify(pageOutput)}`,
				isError: false,
				category: "load",
			},
		});

		if (pageOutput) {
			// what type is pageOutput?

			// step four - check if pageOutput is a page reference
			if ("id" in pageOutput) {
				// page output is a page reference!! yay!

				// step five - check if the reference is a dynamic reference to the next or previous page
				if (pageOutput.id === "$prev" && currentPage.prevPage) {
					this.#debugMessage({
						type: "debug",
						data: {
							message: `Calling dynamic previous page "${currentPage.prevPage.id}"`,
							isError: false,
							category: "load",
						},
					});
					this.currentPage = this.#pages[currentPage.prevPage.id]();
					this.#debugMessage({
						type: "debug",
						data: {
							message: `Setting next page of page "${this.currentPage.id}" to "${currentPage.id}"` /* two similar variables mean different things */,
							isError: false,
							category: "load",
						},
					});
					this.currentPage.nextPage = currentPage;
					return;
				} else if (pageOutput.id === "$next" && currentPage.nextPage) {
					this.#debugMessage({
						type: "debug",
						data: {
							message: `Calling dynamic next page "${currentPage.nextPage.id}"`,
							isError: false,
							category: "load",
						},
					});
					this.currentPage = this.#pages[currentPage.nextPage.id]();
					this.#debugMessage({
						type: "debug",
						data: {
							message: `Setting previous page of page "${currentPage.id}" to "${currentPage.nextPage.id}"`,
							isError: false,
							category: "load",
						},
					});
					this.currentPage.prevPage = currentPage;
					return;
				}

				// step six - check if the reference is a registered page
				else if (this.#pages[pageOutput.id]) {
					this.#debugMessage({
						type: "debug",
						data: {
							message: `Calling registered page "${pageOutput.id}"`,
							isError: false,
							category: "load",
						},
					});
					this.currentPage = this.#pages[pageOutput.id]();
				} else {
					this.#debugMessage({
						type: "debug",
						data: {
							message: `Page "${pageOutput.id}" not found!`,
							isError: true,
							category: "load",
						},
					});
					return;
				}

				const lastPageDirection =
					pageOutput.id === "$prev" ? "nextPage" : "prevPage";

				this.#debugMessage({
					type: "debug",
					data: {
						message: `Setting ${
							lastPageDirection === "nextPage" ? "next" : "previous"
						} page of page "${this.currentPage.id}" to "${
							currentPage.id
						}".`,
						isError: false,
						category: "load",
					},
				});

				this.currentPage[lastPageDirection] = {
					id: currentPage.id,
				};
			} else if ("nonActionReason" in pageOutput) {
				// page output is a page object
				alert(pageOutput.nonActionReason);
			}
			// i disabled SerialKit's built in sideeffect-less page navigation to allow for easier saves and loads.
			// else {
			// 	const oldPage = this.currentPage;
			// 	this.currentPage = pageOutput as SKPageTypes.SKPageOutput;
			// 	this.currentPage[
			// 		pageDirection === "prev" ? "nextPage" : "prevPage"
			// 	] = oldPage;
			// 	oldPage[pageDirection === "prev" ? "nextPage" : "prevPage"] = this.currentPage;
			// }
		} else if (pageOutput === undefined) {
			this.#debugMessage({
				type: "debug",
				data: {
					message: `Page ${this.currentPage.id}'s ${pageDirection} page handler didn't return anything!`,
					isError: true,
					category: "load",
				},
			});
		}
	};

	prevPage = () => {
		this.#callDirectionalPage("prev");
	};

	nextPage = () => {
		this.#callDirectionalPage("next");
	};

	registerPage = (id: string, page: SKPageTypes.SKPageFn) => {
		this.#pages[id] = page;
	};
}
