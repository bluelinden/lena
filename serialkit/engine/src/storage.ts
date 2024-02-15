import SKBasicStorage from "../../utils/src/basic-storage";
import type * as SKTypes from "engine/base/page.types";

export class StorageCatalog {
	#storageInstances: Map<string, SKBasicStorage> = new Map();
	#debugMessageCallback:
		| ((
				message: SKTypes.SKDebugMessage,
				messageArray: SKTypes.SKDebugMessage[]
		  ) => void)
		| undefined;
	onDebugMessage(
		callback: (
			message: SKTypes.SKDebugMessage,
			messageArray: SKTypes.SKDebugMessage[]
		) => void
	) {
		if (import.meta.env.DEV === true) {
			this.#debugMessageCallback = callback;
			this.#debugMessages.forEach((message) => callback(message, []));
		}
	}
	#debugMessages: SKTypes.SKDebugMessage[] = [];
	#debugMessage(message: SKTypes.SKDebugMessage) {
		if (!import.meta.env.DEV) return;
		this.#debugMessages.push(message);
		if (this.#debugMessageCallback) {
			this.#debugMessageCallback(message, this.#debugMessages);
		}
	}

	open(namespace: string, compression: boolean = false, autoLoad = true) {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "storage",
				isError: false,
				message: `Opening storage for ns ${namespace}`,
			},
		});
		if (!this.#storageInstances.has(namespace)) {
			// check if namespace localstorage key has RAW in front of it
			const value = localStorage.getItem(namespace);
			if (value && value.startsWith("OBF:")) {
				this.#debugMessage({
					type: "debug",
					data: {
						category: "storage",
						isError: false,
						message: `Storage for ns ${namespace} exists and is obfuscated`,
					},
				});
			} else if (value && value.startsWith("RAW:")) {
				this.#debugMessage({
					type: "debug",
					data: {
						category: "storage",
						isError: false,
						message: `Storage for ns ${namespace} exists and is not obfuscated`,
					},
				});
			}
			const shouldCompress = compression;

			const storage = new SKBasicStorage(
				namespace,
				shouldCompress,
				import.meta.env.DEV ? this.#debugMessage.bind(this) : undefined
			);

			if (autoLoad) {
				storage.load();
				this.#debugMessage({
					type: "debug",
					data: {
						category: "storage",
						isError: false,
						message: `Storage for ns ${namespace} automatically loaded`,
					},
				});
			}

			this.#storageInstances.set(namespace, storage);
		}

		let openedNamespace = this.#storageInstances.get(namespace)!;

		if (import.meta.env.DEV) {
			openedNamespace = new Proxy(
				this.#storageInstances.get(namespace)!,
				this.#debugProxyHandler()
			);
		}

		return openedNamespace;
	}

	#debugProxyHandler() {
		const thisStorageCatalog = this;
		return {
			get: function (
				target: SKBasicStorage,
				prop: keyof SKBasicStorage,
				receiver: any
			) {
				if (
					prop in target &&
					typeof target[prop as keyof SKBasicStorage] === "function"
				) {
					switch (prop) {
						case "set":
							return function (key: string, value: any) {
								thisStorageCatalog.#debugMessage({
									type: "debug",
									data: {
										category: "storage",
										isError: false,
										message: `Setting key ${key} to ${value} in ns ${target.storageKey}`,
									},
								});
								return target.set.apply(target, [key, value]);
							};
						case "get":
							return function (key: string) {
								// thisStorageCatalog.#debugMessage({
								// 	type: "debug",
								// 	data: {
								// 		category: "storage",
								// 		isError: false,
								// 		message: `Getting key ${key} of ns ${target.storageKey}`,
								// 	},
								// });
								const value = target.get.apply(target, [key]);
								if (value === undefined) {
									thisStorageCatalog.#debugMessage({
										type: "debug",
										data: {
											category: "storage",
											isError: false,
											message: `Key ${key} not found in ns ${target.storageKey}`,
										},
									});
									return undefined;
								}
								thisStorageCatalog.#debugMessage({
									type: "debug",
									data: {
										category: "storage",
										isError: false,
										message: `Got value ${value} of key ${key} of ns ${target.storageKey}`,
									},
								});
								return value;
							};
						case "load":
							return function () {
								thisStorageCatalog.#debugMessage({
									type: "debug",
									data: {
										category: "storage",
										isError: false,
										message: `Loading ns ${target.storageKey} from local storage`,
									},
								});
								return target.load.apply(target, []);
							};
						case "commit":
							return function () {
								thisStorageCatalog.#debugMessage({
									type: "debug",
									data: {
										category: "storage",
										isError: false,
										message: `Manually committing ns ${target.storageKey} to local storage`,
									},
								});
								return target.commit.apply(target, []);
							};
						case "clear":
							return function () {
								thisStorageCatalog.#debugMessage({
									type: "debug",
									data: {
										category: "storage",
										isError: false,
										message: `Manually clearing ns ${target.storageKey} from local storage`,
									},
								});
								return target.clear.apply(target, []);
							};
						default:
							return target[prop as keyof SKBasicStorage];
					}
				} else {
					return target[prop as keyof SKBasicStorage];
				}
			},
		};
	}

	clearAll() {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "storage",
				isError: false,
				message: `Clearing all LocalStorage`,
			},
		});
		this.#storageInstances.forEach((storage) => {
			storage.clear();
		});
	}
}

export default new StorageCatalog();
