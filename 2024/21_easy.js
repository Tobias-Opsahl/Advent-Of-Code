import fs from "fs/promises";

const inputFilePath = "inputs/21_input.txt";

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
	const processedData = [];
	lines.forEach((line) => {
		const words = line.split("");
		processedData.push(words);
	});
	return processedData;
};

const numberMatrix = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	["X", "0", "A"],
];

const directionalMatrix = [
	["X", "^", "A"],
	["<", "v", ">"],
];

const findIndex = (matrix, element) => {
	for (let i = 0; i < matrix.length; i++) {
		const j = matrix[i].indexOf(element);
		if (j !== -1) {
			return [i, j];
		}
	}
	return [-1, -1];
};

const getDirections = (combination, matrix) => {
	let directions = "";
	let prev = "A";
	let [prevY, prevX] = findIndex(matrix, prev);
	for (let i = 0; i < combination.length; i++) {
		const symbol = combination[i];
		let [y, x] = findIndex(matrix, symbol);
		if (prevY === 3 && y < 3 && x === 0) {
			for (let j = 0; j < prevY - y; j++) {
				directions += "^";
			}
			prevY = y;
		} else if (matrix.length === 2 && prevY === 0 && y > 0 && x === 0) {
			directions += "v";
			prevY = 1;
		}

		if (Math.random() < 0.5) {
			// Process x first
			if (prevX > x) {
				for (let j = 0; j < prevX - x; j++) {
					directions += "<";
				}
			} else if (x > prevX) {
				for (let j = 0; j < x - prevX; j++) {
					directions += ">";
				}
			}
			if (prevY > y) {
				for (let j = 0; j < prevY - y; j++) {
					directions += "^";
				}
			} else if (y > prevY) {
				for (let j = 0; j < y - prevY; j++) {
					directions += "v";
				}
			}
		} else {
			// Process y first
			if (prevY > y) {
				for (let j = 0; j < prevY - y; j++) {
					directions += "^";
				}
			} else if (y > prevY) {
				for (let j = 0; j < y - prevY; j++) {
					directions += "v";
				}
			}
			if (prevX > x) {
				for (let j = 0; j < prevX - x; j++) {
					directions += "<";
				}
			} else if (x > prevX) {
				for (let j = 0; j < x - prevX; j++) {
					directions += ">";
				}
			}
		}

		directions += "A";
		prev = symbol;
		prevY = y;
		prevX = x;
	}
	// console.log(directions);
	return directions;
};

const getShortestDirection = (combination) => {
	let directional = getDirections(combination, numberMatrix);
	for (let i = 0; i < 2; i++) {
		directional = getDirections(directional, directionalMatrix);
	}
	return directional.length;
};

const getComplexity = (combinations) => {
	let totalComplexity = 0;
	combinations.forEach((combination) => {
		const shortestList = []
		for (let i = 0; i < 100; i++) {
			shortestList.push(getShortestDirection(combination));
		}
		const shortest = Math.min(...shortestList)
		totalComplexity += shortest * Number(combination.slice(0, -1).join(""));
		console.log(shortest, Number(combination.slice(0, -1).join("")));
	});
	return totalComplexity;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const combinations = processData(data);
	const results = getComplexity(combinations);
	console.log(results);
};

main();
