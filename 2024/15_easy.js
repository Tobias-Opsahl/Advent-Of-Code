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
			map.push(line.split(""));
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
	let isWall = false;
	let newY = nextY;
	let newX = nextX;
	while (!isWall) {
		[newY, newX] = getNextPosition(movement, newY, newX);
		if (map[newY][newX] === "O") {
			continue;
		}
		if (map[newY][newX] === "#") {
			isWall = true;
			break;
		}
		if (map[newY][newX] === ".") {
			map[newY][newX] = "O";
			map[nextY][nextX] = "@";
			map[y][x] = ".";
			return [map, nextY, nextX];
		}
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
	movements.forEach((movement) => {
		[map, y, x] = conductSingleMovement(map, movement, y, x);
	});
	return map;
};

const calculateScore = (map) => {
	let score = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "O") {
				score += 100 * i + j;
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
	const [map, movements] = processData(data);
	const newMap = conductMovements(map, movements);
	const results = calculateScore(map);
	printMap(newMap);
	console.log(results);
};

main();
