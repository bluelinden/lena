export declare type SKPageOutput = {
	on: SKOnEventDefinition;
	navOptions: {
		allowNextPage: boolean;
		allowPrevPage: boolean;
	};

	inputDef?: SKListInputDef;

	inputValues?: Record<
		string,
		string | number | boolean | Record<string, boolean>
	>;
	prevPage?: SKPageRef;
	nextPage?: SKPageRef;
	reevaluatePageDecisions?: boolean;
	titleMarker: string;
	content: string;
	passed?: boolean;
	transient?: boolean;
	id: string;

}

export declare type SKDebugMessage = {
	type: "debug";
	data: {
		category: "load" | "registry" | "storage" | "init" | "security" | "ui" | "input" | "meta";
		message: string;
		isError: boolean;
		isInternal?: boolean;
	};
};

export declare type SKPageFn = () => SKPageOutput;

export interface SKPageRef {
	id: string;
}

export type SKListInputDef = {
	group: string;
	persistent?: boolean;
	numbered: boolean;
	content: {
		id: string;
		value: string;
		label: string;
	}[];
};

export type SKOnEventDefinition = {
	pageNext?: (ev: SKEventData) => SKPageNonActionReason | SKPageRef;
	pagePrev?: (ev: SKEventData) => SKPageNonActionReason | SKPageRef;
	inputChange?: (ev: SKEventData) => SKEventHandlerResponse;
};

export interface SKPageNonActionReason {
	nonActionReason: string;
}

export interface SKEventHandlerResponse {
	showNextButton?: boolean;
	showPrevButton?: boolean;
}

export interface SKEventData {
	inputValues: Record<
		string,
		string | number | boolean | Record<string, boolean>
	>;
	oldValue?: string | number | boolean | Record<string, boolean>;
	event: {
		type: "inputChange" | "nextPage" | "previousPage" | "call";
		fieldName?: string;
	};
}

export interface SKCallEVentData extends SKEventData {
	event: {
		type: "call";
		context: "fromNext" | "fromPrev";
		priorPage: SKPageOutput;
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
