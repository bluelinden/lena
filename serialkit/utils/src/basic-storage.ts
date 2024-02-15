import { compress, decompress } from "compress-json";
import type * as SKTypes from "engine/base/page.types";

export default class SKStorage {
	#values: Map<string, any>;
	nextCommitTime: number = -1;
	#separator = ":/:DO=NOT=MODIFY:/:";

	constructor(
		public readonly storageKey = "gamedata",
		private enableCompression = false,
		debugCallback?: (message: SKTypes.SKDebugMessage) => void
	) {
		if (debugCallback) {
			this.#debugCallback = debugCallback;
		}
		this.#debugMessage({
			type: "debug",
			data: {
				category: "storage",
				isError: false,
				message: `Constructing LocalStorage handler for ns ${storageKey}`,
				isInternal: true,
			},
		});
		this.#values = new Map();
	}

	#debugCallback?: (message: SKTypes.SKDebugMessage) => void;

	#debugMessage(message: SKTypes.SKDebugMessage) {
		if (this.#debugCallback) {
			this.#debugCallback(message);
		}
	}

	set(key: string, value: any) {
		this.#values.set(key, value);
		// disable autocommit
		// this.nextCommitTime = Date.now() + 499;
		// setTimeout(() => this.checkIfShouldCommit(), 500);
		return this;
	}

	// check if should commit by seeing if the last commit time is less than 500ms ago. if it is, exit. if it isn't, commit.
	checkIfShouldCommit() {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "storage",
				isError: false,
				message: `Checking if should commit LocalStorage for ns ${this.storageKey}`,
				isInternal: true,
			},
		});
		if (
			this.nextCommitTime < Date.now() - 450 &&
			this.nextCommitTime !== -1
		) {
			this.#debugMessage({
				type: "debug",
				data: {
					category: "storage",
					isError: false,
					message: `Should commit LocalStorage for ns ${this.storageKey}`,
					isInternal: true,
				},
			});
			this.commit();
		}
	}

	get(key: string) {
		return this.#values.get(key);
	}

	commit() {
		let final: string;

		if (this.enableCompression) {
			// look - this isn't intended to be secure. not even that hard to break. but i want people to have a consistent experience, and to not f*ck around with games in this engine.
			const valuesasObject: Record<string, any> = {};
			this.#values.forEach((value, key) => {
				valuesasObject[key] = value;
			});
			const compressed = compress(valuesasObject);
			const stringified = JSON.stringify(compressed);
			const encoded = encodeURIComponent(stringified);
			const base64 = btoa(encoded);

			// generate hash
			const hashPre = crypto.subtle.digest(
				"SHA-256",
				new TextEncoder().encode(stringified)
			);

			hashPre.then((hash) => {
				final =
					"OBF" +
					this.#separator +
					btoa(
						encodeURIComponent(
							JSON.stringify(
								compress({
									hh: Array.from(new Uint8Array(hash))
										.map((b) => b.toString(16).padStart(2, "0"))
										.join(""),
									ve: base64,
								})
							)
						)
					);

				this.#debugMessage({
					type: "debug",
					data: {
						category: "storage",
						isError: false,
						message: `Committing LocalStorage for ns ${this.storageKey}`,
						isInternal: true,
					},
				});
				localStorage.setItem(this.storageKey, final);
			});
		} else {
			final = JSON.stringify(Object.fromEntries(this.#values));
			localStorage.setItem(this.storageKey, "RAW" + this.#separator + final);
		}
	}

	load() {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "storage",
				isError: false,
				message: `Loading LocalStorage for ns ${this.storageKey}`,
				isInternal: true,
			},
		});
		try {
			const value = localStorage.getItem(this.storageKey);
			if (value) {
				const [type, data] = value.split(this.#separator);
				if (type === "OBF") {
					// decode the stored data
					const decoded = decodeURIComponent(atob(data));
					// decompress the data
					const decompressed = decompress(JSON.parse(decoded));
					// extract the hash value
					const hashValue = decompressed.hh;
					// decode the base64 encoded data
					const base64Decoded = atob(decompressed.ve);
					// decode the URI component
					const decodedURI = decodeURIComponent(base64Decoded);
					// calculate the hash
					const hash = crypto.subtle.digest(
						"SHA-256",
						new TextEncoder().encode(decodedURI)
					);
					// compare the calculated hash with the hash from stored data
					hash.then((calculatedHash) => {
						const calculatedHashStr = Array.from(
							new Uint8Array(calculatedHash)
						)
							.map((b) => b.toString(16).padStart(2, "0"))
							.join("");
						if (calculatedHashStr === hashValue) {
							this.#debugMessage({
								type: "debug",
								data: {
									category: "storage",
									isError: false,
									message: `Hash valid for LocalStorage ns ${this.storageKey}`,
									isInternal: true,
								},
							});
							const valuesAsCompressedObject = JSON.parse(decodedURI);
							const valuesAsObject = decompress(
								valuesAsCompressedObject
							);

							// zero fucking clue what i'm doing here
							delete valuesAsObject["0"];
							delete valuesAsObject["1"];
							this.#values = new Map(Object.entries(valuesAsObject));
							this.#debugMessage({
								type: "debug",
								data: {
									category: "storage",
									isError: false,
									message: `Loaded LocalStorage for ns ${
										this.storageKey
									}, with values ${JSON.stringify(valuesAsObject)}`,
									isInternal: true,
								},
							});
						} else {
							this.#debugMessage({
								type: "debug",
								data: {
									category: "storage",
									isError: true,
									message: `Hash invalid for LocalStorage ns ${this.storageKey}`,
									isInternal: true,
								},
							});
						}
					});
				} else if (type === "RAW") {
					const valuesAsObject = JSON.parse(data);
					this.#values = new Map(Object.entries(valuesAsObject));
					this.#debugMessage({
						type: "debug",
						data: {
							category: "storage",
							isError: false,
							message: `Loaded LocalStorage for ns ${
								this.storageKey
							}, with values ${JSON.stringify(valuesAsObject)}`,
							isInternal: true,
						},
					});
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	clear() {
		this.#debugMessage({
			type: "debug",
			data: {
				category: "storage",
				isError: false,
				message: `Clearing LocalStorage for ns ${this.storageKey}`,
				isInternal: true,
			},
		});
		localStorage.removeItem(this.storageKey);
		this.#values.clear();
	}
}
