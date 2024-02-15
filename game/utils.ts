import SKStorage from "engine/storage";

const setting = SKStorage.open("gamesettings").get("censor") ?? true;

const SKCensoredWords: Record<string, string> = {
	shit: "crap",
	ass: "butt",
	asshole: "butthole",
	fuck: "fudge",
};

export function censor(word: string, alternate?: string) {
	if (word in SKCensoredWords) {
		return SKCensoredWords[word];
	}
	return setting ? alternate : word;
}
