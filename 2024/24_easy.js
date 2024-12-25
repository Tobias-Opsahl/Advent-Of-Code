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

const computeGates = (values, gates) => {
	let z = [];
	let foundUndefined = true;
	while (foundUndefined) {
		foundUndefined = false;
		for (const gate of gates) {
			const [input1, operation, input2, output] = gate;
			if (values.has(output)) {
				continue;
			}
			const value1 = values.get(input1);
			const value2 = values.get(input2);
			if (value1 === undefined || value2 === undefined) {
				foundUndefined = true;
				continue;
			}
			let outputValue;
			if (operation === "AND") {
				outputValue = value1 & value2;
			} else if (operation === "OR") {
				outputValue = value1 | value2;
			} else if (operation === "XOR") {
				outputValue = value1 ^ value2;
			}
			values.set(output, outputValue);
			if (output[0] === "z") {
				z.push([output, outputValue]);
			}
		}
	}
	z = z.sort((a, b) => b[0].localeCompare(a[0]));
	return z;
}

const getNumber = (z) => {
	let number = "";
	for (const value of z) {
		number += value[1];
	}
	number = parseInt(number, 2);
	return number;
}

const main = async () => {
	const data = await readInput(inputFilePath);
	const [values, gates] = processData(data);
	const z = computeGates(values, gates);
	const number = getNumber(z);
	console.log(number);
};

main();
