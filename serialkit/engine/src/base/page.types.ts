export declare interface SKPageOutput {
	on: SKOnEventDefinition;
	navOptions: {
		initiallyAllowPrevPage: boolean;
		initiallyAllowNextPage: boolean;
	};
	nonActionReason?: undefined;
	inputValues : Record<string, SKBooleanField | SKMultiField | SKStringField>;
	prevPage?: SKPageOutput;
	nextPage?: SKPageOutput;
	reevaluatePageDecisions?: boolean;
	actions: SKActionDefinition[];
	titleMarker: string;
	content: string;
	previousPage?: SKPageOutput;
	passed?: boolean;
}

export type SKActionDefinition = {};

export type SKInputListDefinition = {};

export type SKOnEventDefinition = {
	pageNext: (ev: SKEventData) => SKPageOutput | SKPageNonActionReason;
	pagePrev: (ev: SKEventData) => SKPageOutput | SKPageNonActionReason;
	inputChange: (ev: SKEventData) => SKEventHandlerResponse;
};

export interface SKPageNonActionReason {
	nonActionReason: string;
}

export interface SKEventHandlerResponse {
	showNextButton: boolean;
	showPreviousButton: boolean;
}

export interface SKEventData {
	inputValues: Record<string, SKBooleanField | SKMultiField | SKStringField>;
	event: {
		type: "inputChange" | "nextPage" | "previousPage";
		fieldName?: string;
	};
}

export interface SKPersistentPageData {
	inputValues: Record<string, string | number | Record<string, boolean>>;
	customData: SKPagePersistentCustomDataInterface;
}

export interface SKPersistentInputData {
	getValue: (name: string) => SKBooleanField | SKMultiField | SKStringField;
}

export interface SKPagePersistentCustomDataInterface {
	setValue: (name: string, data: any) => void;
	getValue: (name: string) => any;
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
