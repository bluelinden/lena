import { Marked } from "marked";

import variableStore from "./variable-store";

export type SKMarkdown = string;

export default function SKBodyParse(
	input: string,
	options: SKBodyParserOptions
) {
	const mdInput = new Marked().parse(input, { async: false }) as string;

	const regexes = {
		SKEscape: /(&\{\s*.*?\s*\})/gm,
		SKEscapeParse: /&\{\s*(.*?)\s*\}/gm,
		SKFormInput:
			/(?<type>\S+)\s*\(\s*(?<display>.*?)\s*\)\s*to\s*\((?<behavior>\S+)\)/gm,
		SKTextInputDisplayOptions:
			/(?<label>[^:\n]+)(?::\s*(?<placeholder>.+))?/gm,
		SKRadioDisplayOptions: /(?:(?<number>[0-9]+)#)?\s*(?<label>[^\n]+)/gm,
		SKInputGroupAndName: /\(\s*(?<group>\S+)\s*:\s*(?<name>\S+)\s*\)/gm,
	};

	const splitString = mdInput.split(regexes.SKEscape);
	const jobQueue = [] as SKBodyCreatorTask[];

	for (const testString of splitString) {
		// take the command out from the shell
		const parsedCommand = testString.match(regexes.SKEscapeParse)?.[0];
		if (parsedCommand) {
			// parse the general input syntax
			const SKFormInputInfo = parsedCommand.match(regexes.SKFormInput);
			if (SKFormInputInfo?.[0]) {
				// figure out what type of input it is
				const formType = SKFormInputInfo.groups?.type;
				switch (formType) {
					case "TextInput":
						const textInputDisplayOptions =
							SKFormInputInfo.groups?.display.match(
								regexes.SKTextInputDisplayOptions
							)?.groups;
						const fieldName = SKFormInputInfo.groups?.behavior;
						jobQueue.push({
							type: "insertInput",
							element: {
								type: "string",
								name: SKFormInputInfo.groups?.behavior ?? "",
								label:
									textInputDisplayOptions?.label.replace(/^\~/g, "") ??
									"",
								labelHidden:
									textInputDisplayOptions?.label.startsWith("~") ??
									false,
								placeholder: textInputDisplayOptions?.placeholder ?? "",
							},
						} as SKTextInputAddTask);

						break;
					case "Radio":
						const radioLabel = SKFormInputInfo.groups?.display.match(
							regexes.SKRadioDisplayOptions
						)?.groups?.label;

						const radioOptions = SKFormInputInfo.groups?.behavior.match(
							regexes.SKInputGroupAndName
						);

						if (radioOptions?.groups?.number) {
							throw new Error(
								"numbered radio groups are not yet supported"
							);
						}

						jobQueue.push({
							type: "insertInput",
							element: {
								type: "radio",
								name: radioOptions?.groups?.name ?? "",
								label: radioLabel ?? "",
								group: radioOptions?.groups?.group ?? "",
							},
						} as SKRadioInputAddTask);

						break;

					case "Checkbox":
						const checkLabel = SKFormInputInfo.groups?.display.match(
							regexes.SKRadioDisplayOptions
						)?.groups?.label;
						const checkboxOptions =
							SKFormInputInfo.groups?.behavior.match(
								regexes.SKInputGroupAndName
							);

						jobQueue.push({
							type: "insertInput",
							element: {
								type: "check",
								name: checkboxOptions?.groups?.name ?? "",
								value: false,
								label: checkLabel ?? "",
								group: checkboxOptions?.groups?.group ?? "",
							},
						} as SKCheckboxInputAddTask);
					default:
						throw new Error(`Unimplemented form type: ${formType}`);
				}
			}
		} else {
			// add the text to the body
			jobQueue.push({
				type: "insertText",
				text: testString,
			} as SKBodyTextAddTask);
		}
	}

	const outputDOM = document.createElement("div");
	outputDOM.id = "SerialKit-Markdown-Body";

	jobQueue.forEach((task) => {
		switch (task.type) {
			case "insertInput":
				switch ((task as SKInputAddTask).element.type) {
					case "string":
						const newTextInput = document.createElement("input");
						newTextInput.type = "text";
						newTextInput.name = (task as SKTextInputAddTask).element.name;
						newTextInput.id = (task as SKTextInputAddTask).element.name;
						newTextInput.placeholder = (
							task as SKTextInputAddTask
						).element.placeholder;
						const newTextLabel = document.createElement("label");
						newTextLabel.innerText = (
							task as SKTextInputAddTask
						).element.label;
						if ((task as SKTextInputAddTask).element.labelHidden) {
							newTextLabel.style.left = "-10000px";
							newTextLabel.style.position = "absolute";
						}
						outputDOM.appendChild(newTextLabel);
						outputDOM.appendChild(newTextInput);
						break;
					case "radio":
						const newRadioInput = document.createElement("input");
						newRadioInput.type = "radio";
						newRadioInput.name = (
							task as SKRadioInputAddTask
						).element.name;
						newRadioInput.id = (task as SKRadioInputAddTask).element.name;
						newRadioInput.name = (
							task as SKRadioInputAddTask
						).element.group;
						newRadioInput.value = (
							task as SKRadioInputAddTask
						).element.name;

						const newRadioLabel = document.createElement("label");
						newRadioLabel.innerText = (
							task as SKRadioInputAddTask
						).element.label;

						outputDOM.appendChild(newRadioLabel);
						outputDOM.appendChild(newRadioInput);

						break;
					case "check":
						const newCheckboxInput = document.createElement("input");
						newCheckboxInput.type = "checkbox";
						newCheckboxInput.name = (
							task as SKCheckboxInputAddTask
						).element.group;
						newCheckboxInput.id = (
							task as SKCheckboxInputAddTask
						).element.name;
						const newCheckboxLabel = document.createElement("label");
						newCheckboxLabel.innerText = (
							task as SKCheckboxInputAddTask
						).element.label;

						outputDOM.appendChild(newCheckboxLabel);
						outputDOM.appendChild(newCheckboxInput);
				}
				break;
			case "insertText":
				const newTextNode = document.createTextNode(
					(task as SKBodyTextAddTask).text
				);
				outputDOM.appendChild(newTextNode);
				break;
			case "insertVariable":
				throw new Error(
					"Inline variables are not implemented. Use a template string, they're supported by like 99% of browsers at this point. You shouldn't be using SerialKit if you're targeting anything below ES6."
				);
		}
	});
}

interface SKBodyCreatorTask {
	type: "insertInput" | "insertText" | "insertVariable";
}

interface SKBodyTextAddTask extends SKBodyCreatorTask {
	type: "insertText";
	text: string;
}

interface SKInputAddTask extends SKBodyCreatorTask {
	type: "insertInput";
	element: {
		type: "string" | "radio" | "check";
	};
}

interface SKTextInputAddTask extends SKInputAddTask {
	element: {
		type: "string";
		name: string;
		placeholder: string;
		label: string;
		labelHidden: boolean;
	};
}

interface SKCheckboxInputAddTask extends SKInputAddTask {
	element: {
		type: "check";
		name: string;
		label: string;
		group: string;
		value: boolean;
	};
}

interface SKRadioInputAddTask extends SKInputAddTask {
	element: {
		type: "radio";
		name: string;
		label: string;
		group: string;
	};
}

interface SKBodyParserOptions {
	/**
	 * Allow HTML in the input body, at all. Disabled by default. Setting this to true disables HTML purification.
	 */
	allowHTML?: boolean;

	/**
	 * Enable syntax for displaying SerialKit globals in text. Only enabled when parsing skit files by default.
	 */
	enableReadingSKGlobals?: boolean;
}
