import type { SKMarkdown } from "../skmarkdown";

export default interface SKPageOutput {
	on: SKOnEventDefinition
	navOptions: {
		allowPrevPage: boolean;
		allowNextPage: boolean;
	}
	titleMarker: string;
	content: string;
}

export type SKOnEventDefinition = {
	event: (ev: SKEventData) => void;
} | {
	pageNext: (ev: SKEventData) => void;
	pagePrev: (ev: SKEventData) => void;
	inputChange: (ev: SKEventData) => void;
}

export interface SKEventData {
	warn: (text: SKMarkdown) => void;
	inputValues: Record<string, string | number | boolean>;
	event: {
		type: "inputChange" | "nextPage" | "previousPage";
		field?: SKBooleanField | SKMultiField | SKStringField;
	};
	transitionTo: (
		page: (params: Record<string, any>) => SKPageOutput,
		params?: Record<string, any>
	) => void;
}

export interface SKBooleanField {
	type: "boolean";
	name: string;
	oldValue: boolean;
	value: boolean;
}

export interface SKStringField {
	type: "string";
	name: string;
	oldValue: string;
	value: string;
}

export interface SKMultiField {
	type: "multi";
	name: string;
	oldValue: Record<string, boolean>;
	value: Record<string, boolean>;
}
