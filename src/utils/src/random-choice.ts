// pick a random choice from the options listed, with weights as well
// adapted from work by radvylf-programs on stackoverflow

export function randomChoice(items: any[], weights?: number[]) {
	if (!weights) weights = new Array(items.length).fill(1);

	let i;

	for (i = 1; i < weights.length; i++) weights[i] += weights[i - 1];

	let random = Math.random() * weights[weights.length - 1];

	for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

	return items[i];
}
