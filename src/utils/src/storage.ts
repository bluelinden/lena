import { compress, decompress } from "compress-json";

export default class StorageManager {
	#values: Record<string, any> = {};
	nextCommitTime: number = -1;

	constructor(
		private storageKey = "gamedata",
		private enableCompression = false
	) {}

	set(key: string, value: any) {
		this.#values[key] = value;
		this.nextCommitTime = Date.now() + 499;
		setTimeout(() => this.checkIfShouldCommit(), 500);
	}

	// check if should commit by seeing if the last commit time is less than 500ms ago. if it is, exit. if it isn't, commit.
	checkIfShouldCommit() {
		if (this.nextCommitTime < Date.now() - 499 && this.nextCommitTime !== -1) {
			this.commit();
		}
	}

	get(key: string) {
		return this.#values[key];
	}

	commit() {
		let final: string;

		if (this.enableCompression) {
			// look - this isn't intended to be secure. not even that hard to break. but i want people to have a consistent experience, and to not f*ck around with games in this engine.
			const compressed = compress(this.#values);
			const stringified = JSON.stringify(compressed);
			const encoded = encodeURIComponent(stringified);
			const base64 = btoa(encoded);

			// generate hash
			const hashPre = new Crypto().subtle.digest(
				"SHA-256",
				new TextEncoder().encode(stringified)
			);

			hashPre.then((hash) => {
				final =
					"COMPRESSED:" +
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

				localStorage.setItem(this.storageKey, final);
			});
		} else {
			final = JSON.stringify(this.#values);
			localStorage.setItem(this.storageKey, "RAW:" + final);
		}
	}

	load() {
		const value = localStorage.getItem(this.storageKey);
		if (value) {
			const [type, data] = value.split(":");
			if (type === "COMPRESSED") {
				const decoded1 = decompress(
					JSON.parse(decodeURIComponent(atob(data)))
				);

				if (decoded1.hh === undefined) {
					return;
				}

				const hashPre = new Crypto().subtle.digest(
					"SHA-256",
					new TextEncoder().encode(JSON.stringify(decoded1.ve))
				);

				hashPre.then((hashPre2) => {
					const hash = Array.from(new Uint8Array(hashPre2))
						.map((b) => b.toString(16).padStart(2, "0"))
						.join("");
					// if hashes don't match, don't load
					if (decoded1.hh !== hash) {
						this.#values = {};
						return;
					}

					const decoded2 = JSON.parse(
						decompress(JSON.parse(decodeURIComponent(atob(decoded1.ve))))
					);

					this.#values = decoded2;
				});
			} else if (type === "RAW") {
				this.#values = JSON.parse(data);
			}
		}
	}
}
