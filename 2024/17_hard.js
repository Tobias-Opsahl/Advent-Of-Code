import fs from "fs/promises";
const inputFilePath = "inputs/17_input.txt";

const readInput = async (filePath) => {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return data;
	} catch (err) {
		console.error("Error reading the file:", err);
		throw err;
	}
};

const processData = (data) => {
	const lines = data.split("\n");
	let instructionInput = false;
	let registers = new Map();
	let instructions;
	for (let line of lines) {
		line = line.trim();
		if (line === "") {
			instructionInput = true;
			continue;
		}
		if (instructionInput) {
			const words = line.split(" ");
			instructions = words[1].split(",").map(Number);
		} else {
			const words = line.split(" ");
			const registerName = words[1].slice(0, -1);
			const registerValue = Number(words[2]);
			registers.set(registerName, registerValue);
		}
	}
	return [registers, instructions];
};

const modulo = (n, m) => {
	return ((n % m) + m) % m;
};

const getComboOperant = (registers, operant) => {
	if ([0, 1, 2, 3].includes(operant)) {
		return operant;
	}
	if (operant === 4) {
		return registers.get("A");
	}
	if (operant === 5) {
		return registers.get("B");
	}
	if (operant === 6) {
		return registers.get("C");
	}
	throw new Error(`Error! Recieved ${operant} as a combo operant!!!`);
};

const division = (registers, operant) => {
	const numerator = registers.get("A");
	const denomenator = Math.pow(2, getComboOperant(registers, operant));
	let results = Math.trunc(numerator / denomenator);
	return results;
};

const xor = (a, b) => {
	return a ^ b;
};

const adv = (registers, operant) => {
	const results = division(registers, operant);
	registers.set("A", results);
	return registers;
};

const bxl = (registers, operant) => {
	const results = xor(registers.get("B"), operant);
	registers.set("B", results);
	return registers;
};

const bst = (registers, operant) => {
	const results = modulo(getComboOperant(registers, operant), 8);
	registers.set("B", results);
	return registers;
};

const jnz = (registers, operant) => {
	if (registers.get("A") === 0) {
		return registers;
	}
	registers.set("I", operant);
	return registers;
};

const bxc = (registers) => {
	const results = xor(registers.get("B"), registers.get("C"));
	registers.set("B", results);
	return registers;
};

const out = (registers, operant) => {
	const results = modulo(getComboOperant(registers, operant), 8);
	let output = registers.get("output");
	output.push(results);
	registers.set("output", output);
	return registers;
};

const bdv = (registers, operant) => {
	const results = division(registers, operant);
	registers.set("B", results);
	return registers;
};

const cdv = (registers, operant) => {
	const results = division(registers, operant);
	registers.set("C", results);
	return registers;
};

const performSingleInstruction = (registers, opcode, operant) => {
	switch (opcode) {
		case 0:
			return adv(registers, operant);
		case 1:
			return bxl(registers, operant);
		case 2:
			return bst(registers, operant);
		case 3:
			return jnz(registers, operant);
		case 4:
			return bxc(registers);
		case 5:
			return out(registers, operant);
		case 6:
			return bdv(registers, operant);
		case 7:
			return cdv(registers, operant);
	}
};


const performInstructions = (registers, instructions) => {
	registers.set("I", -1);
	registers.set("output", []);
	let i = 0;
	while (i < instructions.length - 1) {
		registers = performSingleInstruction(registers, instructions[i], instructions[i + 1]);
		if (registers.get("I") === -1) {
			i += 2;
		} else {
			i = registers.get("I");
			registers.set("I", -1);
		}
	}
	const output = registers.get("output");
	return output;
};


function findA(registers, instructions, a = 0, depth = 0) {
	if (depth === instructions.length) {
		return a;
	}

	for (let i = 0; i < 8; i++) {
		let newRegisters = new Map(registers);
		newRegisters.set("A", 8 * a + i);
		const output = performInstructions(newRegisters, instructions);
		if (output[0] === instructions[instructions.length - 1 - depth]) {
			const result = findA(registers, instructions, a * 8 + i, depth + 1);
			if (result !== 0) {
				return result;
			}
		}
	}

	return 0;
}

const main = async () => {
	const data = await readInput(inputFilePath);
	const [registers, instructions] = processData(data);
	const results = findA(registers, instructions);
	console.log(results);
};

main();
