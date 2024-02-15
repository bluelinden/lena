import * as SKPageTypes from "engine/base/page.types";
import SKStorage from "engine/storage";
import { censor } from "game/utils";

const storage = SKStorage.open("gamedata", false);

enum SKC1AVars {
	firstAlarmOption = "first-alarm-option",
}

export const firstAlarm: SKPageTypes.SKPageFn = () => {
	let pickedOption = storage.get(SKC1AVars.firstAlarmOption);
	return {
		id: "ch1-first-alarm",
		navOptions: {
			allowNextPage: false,
			allowPrevPage: false,
		},
		on: {
			pageNext: () => {
				return {
					id: "ch1-second-alarm",
				};
			},
			inputChange: (ev) => {
				if (ev.inputValues["1alarm"] === "silence") {
					return {
						showNextButton: true,
					};
				} else {
					return {
						showNextButton: false,
					};
				}
			},
		},
		titleMarker: "ring ring...",
		content: `Lena wakes up to a ringing noise. She opens her eyes slowly and looks at her closed blinds and messy floor. She grumbles, shifts in her bed a little bit, and then...`,
		inputDef: {
			group: "1alarm",
			persistent: true,
			numbered: true,
			content: [
				{
					id: "silence",
					value: "silence",
					label: "silences her phone's alarm.",
				},
				{
					id: "sleeps",
					value: "sleeps",
					label: "ignores it and goes back to sleep.",
				},
			],
		},
	};
};

export const secondAlarm: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-second-alarm",
		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		titleMarker: "Ring Ring.",
		content: `As she starts to fall asleep again, she's interrupted by another alarm. This one sounds a little clearer. She...`,
		inputDef: {
			group: "2alarm",
			numbered: true,
			persistent: true,
			content: [
				{
					id: "throws",
					value: "throws",
					label: "throws her phone across the room.",
				},
			],
		},
		on: {
			inputChange: (ev) => {
				if (ev.inputValues["2alarm"] === "throws") {
					return {
						showNextButton: true,
					};
				} else {
					return {
						showNextButton: false,
					};
				}
			},
			pagePrev: () => {
				return {
					id: "ch1-first-alarm",
				};
			},
			pageNext: () => {
				return {
					id: "ch1-third-alarm",
				};
			},
		},
	};
};

export const thirdAlarm: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-third-alarm",
		navOptions: {
			allowNextPage: true,
			allowPrevPage: true,
		},
		titleMarker: "RING RING.",
		content: `Somehow, that silences the alarm. She starts to fade again, until a third alarm goes off. Now she *knows* something is up. She reaches for her phone... But it's across the room. She slowly shuffles out of bed, and walks closer to the phone. It's 7:55. On August 28th. 
		
On an ordinary summer day, this would have been totally okay. But it's not an ordinary summer day. It's 7:55. On August 28th. She's trying to figure out what it means - and then she realizes. *It's her first day of ninth grade.*`,
		on: {
			pagePrev: () => {
				return {
					id: "ch1-second-alarm",
				};
			},
			pageNext: () => {
				return {
					id: "ch1-initial-panic",
				};
			},
		},
	};
};

export const initialPanic: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-initial-panic",
		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		titleMarker: "The first day!?",
		content: `Lena only has 15 minutes to be in her seat in Mx. Danielle's classroom. She drops her phone on the ground in a panic, then checks back on it to make sure it's okay. It is. She dashes out to the Kitchen, opens the nearest cabinet to the door, and grabs...`,
		inputDef: {
			group: "initial-panic",
			numbered: true,
			persistent: true,
			content: [
				{
					id: "ham",
					value: "ham",
					label: "a box of steamed hams that smell *really* bad.",
				},
				{
					id: "chex",
					value: "chex",
					label: "a box of Rice Chex that's more dust than cereal.",
				},
				{
					id: "pipis",
					value: "pipis",
					label: `a glowing blue orb labeled "*Pipis.*" It's unclear whether it's deadly or not.`,
				},
			],
		},

		on: {
			pagePrev: () => {
				return {
					id: "ch1-third-alarm",
				};
			},
			pageNext: () => {
				return {
					id: "ch1-panic-2",
				};
			},
			inputChange: (ev) => {
				if (ev.inputValues["initial-panic"] === "chex") {
					return {
						showNextButton: true,
					};
				} else {
					return {
						showNextButton: false,
					};
				}
			},
		},
	};
};

export const panic2: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-panic-2",
		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		titleMarker: "Sawdust sludge",
		content: `She pours the entire box of Rice Chex into a travel mug, and then pours some milk into it and seals the top. Maybe she can eat it while she's at school. She puts her shoes on and heads out.
		
It's 8:01 and Lena is taking the stairs to the ground floor four at a time. She gets to the bottom and then...`,

		inputDef: {
			group: "panic-2",
			numbered: true,
			persistent: true,
			content: [
				{
					id: "run",
					value: "run",
					label: "starts *absolutely booking it* to her school.",
				},
				{
					id: "walk",
					value: "walk",
					label: "starts walking to her school.",
				},
				{
					id: "idc",
					value: "idc",
					label: "realizes she doesn't really care that much and heads back in.",
				},
			],
		},

		on: {
			pagePrev: () => {
				return {
					id: "ch1-initial-panic",
				};
			},
			pageNext: (ev) => {
				if (ev.inputValues["panic-2"] === "run") {
					return {
						id: "ch1-running-to-school",
					};
				} else {
					return {
						id: "purgatory",
					};
				}
			},
			inputChange: (ev) => {
				if (ev.inputValues["panic-2"] === "run") {
					return {
						showNextButton: true,
					};
				} else {
					return {
						showNextButton: false,
					};
				}
			},
		},
	};
};

export const runningToSchool: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-running-to-school",
		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		titleMarker: "Gulp",
		content: `Lena is giving it her all. Granted, she isn't in track and field or anything, so after about two blocks she needs water. She remembers she has her travel mug, and she...`,
		inputDef: {
			group: "running-to-school",
			numbered: true,
			persistent: true,
			content: [
				{
					id: "chug",
					value: "chug",
					label: "starts chugging it.",
				},
				{
					id: "idc",
					value: "idc",
					label: "remembers what's in it, and doesn't touch it.",
				},
			],
		},
		on: {
			pagePrev: () => {
				return {
					id: "ch1-panic-2",
				};
			},
			pageNext: () => {
				return {
					id: "ch1-spit-take",
				};
			},
			inputChange: (ev) => {
				if (ev.inputValues["running-to-school"] === "chug") {
					return {
						showNextButton: true,
					};
				} else {
					return {
						showNextButton: false,
					};
				}
			},
		},
	};
};

export const spitTake: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-spit-take",
		navOptions: {
			allowNextPage: true,
			allowPrevPage: true,
		},
		titleMarker: "ACK!",
		content: `Lena had read somewhere that it was illegal to spit on the sidewalk. But sometimes breaking a law is necessary for one's health and safety. She spits the mix out and has a small coughing fit, then keeps on running. Now just a block away, at 8:05 AM, she uses the last of her energy to make it to the front door of the school, where she...
		
...trips. And falls on her elbow. *Hard.* It's 8:07 AM. She tries not to cry as she slowly gets up.`,
		on: {
			pagePrev: () => {
				return {
					id: "ch1-running-to-school",
				};
			},
			pageNext: () => {
				return {
					id: "ch1-the-girl",
				};
			},
		},
	};
};

export const theGirl: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-the-girl",
		navOptions: {
			allowNextPage: false,
			allowPrevPage: true,
		},
		titleMarker: "The girl",
		content: `A girl walks into the school. She sees a weird reflection, and turns around to see what is. Then she sees Lena. The girl is going to be late for class, but she doesn't care, and so she rushes to help Lena up.
		
"Hey, you alright?" she asks, as she puts her hand out.

Lena grabs on, getting pulled up way faster than she had expected. She had been looking down, but when she looks up she steps back a few steps. She was a little too close to the girl.
${/* should add choices here, like going down the wrong hallway.*/ null}

It's now 8:08. Lena and the girl both realize this at the same time.

"Thank you so much for helping me up. And, uh... do you have any idea where room D83 is? I have, uh... I have no idea," Lena asks.

The girl responds, "Zero clue. But I think I have that classroom too. Mx. Danielle, right?"

"Well, where is D83?" Lena asks, exasperated. It's 8:09.

The girl notices a sign. "I think it's down this hallway. This door right here has 'D18' on it," she says.

They both start running down the hall with 45 seconds left. They pass by another hallway, and suddenly find themselves in front of a set of doors with R instead of D on them.

"What the hell!?" Lena yells.

"I think it's down this hallway," the girl says. There are fifteen seconds left. The girl spots D83 in the distance, and points to it.

They run down the hallway together, reaching the door with one second to spare. Lena makes it through first, and the girl almost makes it before falling flat on her stomach.

Lena turns around, and sees the girl on the floor. The teacher is just starting to look at the commotion. Lena...`,

		inputDef: {
			group: "the-girl",
			numbered: true,
			persistent: true,
			content: [
				{
					id: "help",
					value: "help",
					label: "goes back to help the girl up.",
				},
				{
					id: "walk",
					value: "walk",
					label: "walks to a desk and sits down.",
				},
			],
		},
		on: {
			pagePrev: () => {
				return {
					id: "ch1-spit-take",
				};
			},
			pageNext: (ev) => {
				switch (ev.inputValues["the-girl"]) {
					case "help":
						return {
							id: "ch1-allie",
						};
					case "walk":
						return {
							id: "purgatory",
						};
					default:
						return {
							id: "purgatory",
						};
				}
			},
			inputChange: (ev) => {
				switch (ev.inputValues["the-girl"]) {
					case "help":
						return {
							showNextButton: true,
						};
					case "walk":
						return {
							showNextButton: true,
						};
					default:
						return {
							showNextButton: false,
						};
				}
			},
		},
	};
};

export const allie: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-allie",
		navOptions: {
			allowNextPage: true,
			allowPrevPage: true,
		},
		titleMarker: "Allie",
		content: `Lena offers her hand to the girl. The girl accepts and pulls herself up, dusting herself off afterward. Lena goes and sits with her friend Diego, while the girl sits alone in the middle of the classroom. 
		
Lena sees this, and calls out, "Hey! Uh... what's your name? Lonely girl! Come sit with us!" to which the girl shrugs and walks over to their table.

Diego introduces himself: "Yo, what's up? I'm Lena's friend, Diego. He/him pronouns, please and thank you."

The girl asks, "I'm assuming they're Lena?" while pointing to Lena. 

"Oh, right, I'm Lena. She/her. Sorry," Lena grins, "What's your name?"

"I'm Allie," the girl chirped, "She/her as well."`,
		on: {
			pagePrev: () => {
				return {
					id: "ch1-the-girl",
				};
			},
			pageNext: () => {
				return {
					id: "ch1-teaser",
				};
			},
		}
	};
};

export const finalPage: SKPageTypes.SKPageFn = () => {
	return {
		id: "ch1-teaser",
		titleMarker: "The end...?",
		content: `Woah, hey! It's me, ~~the *narrator!*~~ **blue linden!** This is a demo. While it would've certainly been great to have this be a full game for the in-school showcase, this project started having a negative effect on my mental health. Other than the occasional demonic possessions, I started losing sleep because this game required so much work. As of now, ${new Date().toLocaleDateString()}, I've spent over 50 hours working on this game and the [SerialKit](https://github.com/bluelinden/serialkit) game engine that powers the page you're reading right now. In the end, it has ended up taking over 2,500 lines of code to show you this text.
		
When you're ready, you can destroy this game's entire world and the characters within it by selecting the option below.`,
		inputDef: {
			group: "destroy",
			numbered: true,
			persistent: false,
			content: [
				{
					id: "destroy",
					value: "destroy",
					label: "Erase it all.",
				},
			],
		},
		navOptions: {
			allowNextPage: false,
			allowPrevPage: false,
		},
		on: {
			pagePrev: () => {
				return {
					id: "ch1-allie",
				};
			},
			pageNext: () => {
				SKStorage.clearAll();
				return {
					id: "dm-hi",
				};
			},
			inputChange: (ev) => {
				if (ev.inputValues["destroy"] === "destroy") {
					return {
						showNextButton: true,
					};
				} else {
					return {
						showNextButton: false,
					};
				}
			}
		}
	};
}