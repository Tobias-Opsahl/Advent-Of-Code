import fs from "fs/promises";

const inputFilePath = "inputs/13_input.txt";

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
	const aCost = 3;
	const bCost = 1;
	const a = machine.get("A");
	const b = machine.get("B");
	const xGoal = machine.get("prize")[0] + 10000000000000;
	const yGoal = machine.get("prize")[1] + 10000000000000;

	// aPresses * a[0] + bPresses * b[0] = xGoal
	// aPresses * a[1] + bPresses * b[1] = yGoal
	// aPresses = (xGoal - bPresses * b[0]) / a[0]
	// ((xGoal - bPresses * b[0]) / a[0]) * a[1] + bPresses * b[1] = yGoal
	// ((xGoal * a[1] - bPresses * b[0] * a[1]) / a[0]) + bPresses * b[1] = yGoal
	// bPresses * (b[1] - b[0] * a[1] / a[0]) = yGoal - xGoal * a[1] / a[0]
	// bPresses * (b[1] * a[0] - b[0] * a[1]) = yGoal * a[0] - xGoal * a[1]
	// bPresses = (yGoal * a[0] - xGoal * a[1]) / (b[1] * a[0] +-b[0] * a[1])

	// With Cramers Rule:
	// let aPresses = (xGoal * b[1] - yGoal * b[0]) / (a[0] * b[1] - a[1] * b[0]);
	// let bPresses = (yGoal * a[0] - xGoal * a[1]) / (a[0] * b[1] - a[1] * b[0]);

	let bPresses = (yGoal * a[0] - xGoal * a[1]) / (b[1] * a[0] - b[0] * a[1]);
	let aPresses = (xGoal - bPresses * b[0]) / a[0];
	if (aPresses >= 0 && bPresses >= 0 && Number.isInteger(aPresses) && Number.isInteger(bPresses)) {
		return aPresses * aCost + bPresses * bCost;
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
