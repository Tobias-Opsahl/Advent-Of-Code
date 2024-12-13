import fs from "fs/promises";

const inputFilePath = "inputs/13_input_small.txt";

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
	const machines = [];
	let machine = new Map();
	for (let line of lines) {
		line = line.trim();
		if (line === "") {
			machines.push(machine);
			machine = new Map();
			continue;
		}
		const words = line.split(/\s+/);
		if (words[0] === "Button") {
			const buttonType = words[1].slice(0, -1);
			const x = Number(words[2].slice(0, -1).split("+")[1]);
			const y = Number(words[3].split("+")[1]);
			machine.set(buttonType, [x, y]);
			continue;
		}
		if (words[0] === "Prize:") {
			const x = Number(words[1].slice(0, -1).split("=")[1]);
			const y = Number(words[2].split("=")[1]);
			machine.set("prize", [x, y]);
		}
	}
	machines.push(machine);
	return machines;
};

const calculateSinglePrice = (machine) => {
	const maxPresses = 100;
	const aCost = 3;
	const bCost = 1;
	const a = machine.get("A");
	const b = machine.get("B");
	const xGoal = machine.get("prize")[0];
	const yGoal = machine.get("prize")[1];
	const candidates = [];

	for (let aPresses = 0; aPresses <= maxPresses; aPresses++) {
		if (aPresses * a[0] > xGoal) {
			break;
		}
		let x = aPresses * a[0];
		if (!((xGoal - x) % b[0] == 0)) {
			continue;
		}
		let bPresses = (xGoal - x) / b[0];
		if (bPresses > 100) {
			continue;
		}
		if (yGoal === aPresses * a[1] + bPresses * b[1]) {
			const cost = aCost * aPresses + bCost * bPresses;
			candidates.push(cost);
		}
	}
	if (candidates.length > 0) {
		return Math.min(...candidates);
	}
	return 0;
};

const calculateTotalPrice = (machines) => {
	let totalPrice = 0;
	machines.forEach((machine) => {
		totalPrice += calculateSinglePrice(machine);
	});
	return totalPrice;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const machines = processData(data);
	const results = calculateTotalPrice(machines);
	console.log(results);
};

main();
