export class SKVariableStore {
	variables: Record<string, string | number | boolean> = {};
	getVariable(name: string) {
		return this.variables[name];
	}
	setVariable(name: string, value: string | number | boolean) {
		this.variables[name] = value;
	}
	variableIsPresent(name: string) {
		return name in this.variables;
	}
	delete(names: string[]) {
		for (const name of names) {
			if (name === "*") {
				this.variables = {};
				return;
			}
			delete this.variables[name];
		}
	}

	getAll() {
		return this.variables;
	}
}

export default new SKVariableStore();