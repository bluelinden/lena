export default class GameStator {
	currentDimension: Dimension | undefined;
	currentDialogueId = "";
}

export class Dimension {
	name: string = "SerialKit Dimension";
	variables: Record<string, number | string> = {};
	pages: Record<string, Page> = {};

	registerDialog(dialogId: string) {}

	getVariable(variableId: string) {}
}

export class Page {
	id: string;
	text: string;
	variables: Record<string, number | string> = {};
	fields: {
		id: string;
		type: 'string' | 'number';
		value: string | number;
		description: string;
		spaceMovesFocus: boolean;
	}[] = [];
	options?: string[];
	optionHandler: (optionId: string, fields: Record<string, string | number>) => Page | null = () => null;
	nextPageHandler?: (fields?: Record<string, string | number>) => string;

	constructor(config: PageConfig) {
		this.id = config.id;
		this.text = config.text;

	}
}

interface PageConfig {
	id: string;
	text: string;
	variables: Record<string, number | string>;
	fields: {
		id: string;
		type: 'string' | 'number';
		value: string | number;
		description: string;
		spaceMovesFocus: boolean;
	}[];
	nextPageHandler?: () => string;
	options?: string[];
	optionHandler?: (optionId: string) => (string);
}


