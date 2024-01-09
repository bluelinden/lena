# SerialKit

## Batteries included, logic not.

Tell complex, non-linear stories with an extremely opinionated game framework that lets you contribute the story without needing to worry about anything else.

Pages are objects, and everything else is a function. There is no hierarchy the engine forces on you, all you need is a function for the "next" button and one for the "back" button, and you're good to go.

Just have your entrypoint in the `main.ts` file, and link your other pages, and SerialKit will follow the objects wherever they lead.

Read the type definitions in `src/engine/base/page.types.ts` to learn how to use them in your game.

Run `bun run build` to build the game.
Run `bun run dev` to start the game in a live environment.

While [Bun](https://bun.sh) is the preferred package manager and runtime for SerialKit, Node/NPM/PNPM/Yarn are also usable, and you can use any of them to build and run your game.