import fs from "fs/promises";

const inputFilePath = "inputs/15_input.txt";

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
	let positionInput = false;
	const map = [];
	const allMovements = [];
	lines.forEach((line) => {
		line = line.trim("");
		if (line === "") {
			positionInput = true;
		}
		if (positionInput) {
			const movements = line.split("");
			allMovements.push(...movements);
		} else {
			let newLine = "";
			line.split("").forEach((char) => {
				switch (char) {
					case "#":
						newLine += "##";
						break;
					case ".":
						newLine += "..";
						break;
					case "O":
						newLine += "[]";
						break;
					case "@":
						newLine += "@.";
						break;
					default:
						throw new Error(`Invalid map character ${char}`);
				}
			});
			map.push(newLine.split(""));
		}
	});
	return [map, allMovements];
};

const getNextPosition = (movement, y, x) => {
	switch (movement) {
		case "^":
			return [y - 1, x];
		case ">":
			return [y, x + 1];
		case "v":
			return [y + 1, x];
		case "<":
			return [y, x - 1];
		default:
			throw new Error(`Invalid movement ${movement}. `);
	}
};

const moveBox = (map, y, x, movement, left, previousChar) => {
	// Vertical movement
	const [nextY, nextX] = getNextPosition(movement, y, x);
	if (map[nextY][nextX] === "#") {
		return [false, map];
	}
	if (map[nextY][nextX] === ".") {
		let tempChar = map[y][x];
		map[y][x] = previousChar;
		map[nextY][nextX] = tempChar;
		return [true, map];
	}
	let tempChar = map[y][x];
	map[y][x] = previousChar;
	previousChar = tempChar;
	if (left) {
		if (map[nextY][nextX] === "[") {
			return moveBox(map, nextY, nextX, movement, left, previousChar);
		}
		if (map[nextY][nextX] === "]") {
			let leftResult;
			let rightResult;
			[leftResult, map] = moveBox(
				map,
				nextY,
				nextX - 1,
				movement,
				true,
				"."
			);
			[rightResult, map] = moveBox(
				map,
				nextY,
				nextX,
				movement,
				false,
				previousChar
			);
			return [leftResult && rightResult, map];
		}
	}
	// right thread
	if (map[nextY][nextX] === "]") {
		return moveBox(map, nextY, nextX, movement, left, previousChar);
	}
	if (map[nextY][nextX] === "[") {
		let leftResults;
		let rightResults;
		[leftResults, map] = moveBox(
			map,
			nextY,
			nextX,
			movement,
			true,
			previousChar
		);
		[rightResults, map] = moveBox(
			map,
			nextY,
			nextX + 1,
			movement,
			false,
			"."
		);
		return [leftResults && rightResults, map];
	}
};

const moveBoxSimple = (map, y, x, movement, previousChar) => {
	// Horizontal movement
	const [nextY, nextX] = getNextPosition(movement, y, x);
	if (map[nextY][nextX] === "#") {
		return [false, map];
	}
	if (map[nextY][nextX] === ".") {
		let tempChar = map[y][x];
		map[y][x] = previousChar;
		map[nextY][nextX] = tempChar;
		return [true, map];
	}
	let tempChar = map[y][x];
	map[y][x] = previousChar;
	previousChar = tempChar;
	return moveBoxSimple(map, nextY, nextX, movement, previousChar);
};

const conductSingleMovement = (map, movement, y, x) => {
	const [nextY, nextX] = getNextPosition(movement, y, x);
	if (map[nextY][nextX] === ".") {
		// Empty position, move robot
		map[nextY][nextX] = "@";
		map[y][x] = ".";
		return [map, nextY, nextX];
	} else if (map[nextY][nextX] === "#") {
		// Wall, no movement
		return [map, y, x];
	}
	// Box
	let newMap = map.map((line) => line.slice());
	if (movement === "<" || movement === ">") {
		let result;
		[result, newMap] = moveBoxSimple(newMap, y, x, movement, ".");
		if (result) {
			return [newMap, nextY, nextX];
		}
		return [map, y, x];
	}
	let newYLeft = y;
	let newYRight = y;
	let newXLeft = x;
	let newXRight = x;
	if (map[nextY][nextX] === "[") {
		newYRight = nextY;
		newXRight = x + 1;
	} else {
		newYLeft = nextY;
		newXLeft = x - 1;
	}
	let leftResult = false;
	let rightResult = false;
	[leftResult, newMap] = moveBox(newMap, newYLeft, newXLeft, movement, true, ".");
	[rightResult, newMap] = moveBox(newMap, newYRight, newXRight, movement, false, ".");
	if (leftResult && rightResult) {
		return [newMap, nextY, nextX];
	}
	return [map, y, x];
};

const getRobotPosition = (map) => {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "@") {
				return [i, j];
			}
		}
	}
	throw new Error(`No Robot. `);
};

const conductMovements = (map, movements) => {
	let [y, x] = getRobotPosition(map);
	for (let i = 0; i < movements.length; i++) {
		const movement = movements[i];
		[map, y, x] = conductSingleMovement(map, movement, y, x);
	}
	return map;
};

const calculateScore = (map) => {
	let score = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "[") {
				let newScore = 100 * i + j;
				score += newScore;
			}
		}
	}
	return score;
};

const printMap = (map) => {
	map.forEach((row) => {
		let line = row.join("");
		console.log(line);
	});
	console.log();
};

const main = async () => {
	const data = await readInput(inputFilePath);
	let [map, movements] = processData(data);
	printMap(map);
	const newMap = conductMovements(map, movements);
	const results = calculateScore(newMap);
	printMap(newMap);
	console.log(results);
	console.log(movements.length)
	// 1413559 too high
	// 1423226
};

main();
