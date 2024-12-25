import fs from "fs/promises";
const inputFilePath = "inputs/24_input.txt";

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
	let gateInput = false;
	let values = new Map();
	let gates = [];
	for (let line of lines) {
		line = line.trim();
		if (line === "") {
			gateInput = true;
			continue;
		}
		if (gateInput) {
			const words = line.split(" ");
			const gate = [words[0], words[1], words[2], words[4]];
			gates.push(gate);
		} else {
			const words = line.split(" ");
			const valueName = words[0].slice(0, -1);
			const value = Number(words[1]);
			values.set(valueName, value);
		}
	}
	return [values, gates];
};

const findMistakes = (gates) => {
	const highestZ = "z45";  // Checked manually, but can easily be found in processing
	const firstX = "x00";
	const mistakes = new Set();
	const xyz = ["x", "y", "z"];
	for (let i = 0; i < gates.length; i++) {
		const [a, op, b, c] = gates[i];
		if (c[0] === "z" && op !== "XOR" && c !== highestZ) {
			mistakes.add(c);
			continue;
		}
		if (op === "XOR" && !xyz.includes(a[0]) && !xyz.includes(b[0]) && !xyz.includes(c[0])) {
			mistakes.add(c);
			continue;
		}
		if (op === "AND" && ![a, b].includes(firstX)) {
			for (let j = 0; j < gates.length; j++) {
				const [a2, op2, b2] = gates[j];
				if ((c === a2 || c === b2) && op2 !== "OR") {
					mistakes.add(c);
				}
			}
			continue;
		}
		if (op === "XOR") {
			for (let j = 0; j < gates.length; j++) {
				const [a2, op2, b2] = gates[j];
				if ((c === a2 || c === b2) && op2 === "OR") {
					mistakes.add(c);
				}
			}
			continue;
		}
	}
	return [...mistakes].sort(); 
}

const main = async () => {
	const data = await readInput(inputFilePath);
	const gates = processData(data)[1];
	const mistakes = findMistakes(gates);
	const results = mistakes.join(",");
	console.log(results);
};

main();
