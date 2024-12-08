import fs from "fs/promises";

const inputFilePath = "inputs/6_input.txt";

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

const printMap = (map) => {
	map.forEach((row) => {
		const line = row.join("");
		console.log(line);
	});
};

const getStartingPosition = (grid) => {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] === "^") {
				// Assumes starting direction is always up
				return [i, j];
			}
		}
	}
	return;
};

const checkIfCompleted = (grid, position) => {
	if (
		position[0] < 0 ||
		position[0] >= grid.length ||
		position[1] < 0 ||
		position[1] >= grid[0].length
	) {
		return true;
	}
	return false;
};

const getNextPosition = (position, direction) => {
	const nextPosition = [...position];
	if (direction === 0) {
		// Up
		nextPosition[0] -= 1;
	} else if (direction === 1) {
		// Right
		nextPosition[1] += 1;
	} else if (direction === 2) {
		// Down
		nextPosition[0] += 1;
	} else if (direction === 3) {
		// Left
		nextPosition[1] -= 1;
	}
	return nextPosition;
};

const walkOneStep = (grid, position, direction) => {
	// if (direction === 0 || direction === 2) {
	// 	grid[position[0]][position[1]] = "|";
	// } else {
	// 	grid[position[0]][position[1]] = "-";
	// }
	grid[position[0]][position[1]] = direction;
	let nextPosition = getNextPosition(position, direction);
	if (!checkIfCompleted(grid, nextPosition)) {
		while (grid[nextPosition[0]][nextPosition[1]] === "#") {
			direction = (direction + 1) % 4; // Rotate
			nextPosition = getNextPosition(position, direction);
		}
	}
	return [grid, nextPosition, direction];
};

const checkCycleInMap = (grid, startingPosition) => {
	let direction = 0;
	let position = startingPosition;
	let completed = checkIfCompleted(grid, position);
	while (!completed) {
		[grid, position, direction] = walkOneStep(grid, position, direction);
		completed = checkIfCompleted(grid, position);
		if (completed) {
			break;
		}
		if (grid[position[0]][position[1]] === direction) {
			// printMap(grid);
			return 1;
		}
		// if (
		// 	grid[position[0]][position[1]] === "|" &&
		// 	(direction === 0 || direction === 2)
		// ) {
		// 	printMap(grid);
		// 	console.log();
		// 	return 1;
		// } else if (
		// 	grid[position[0]][position[1]] === "-" &&
		// 	(direction === 1 || direction === 3)
		// ) {
		// 	return 1;
		// }
	}
	return 0;
};

const countPossibleCycles = (grid, startingPosition) => {
	let cycles = 0;
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] === ".") {
				const gridCopy = grid.map((row) => [...row]);
				gridCopy[i][j] = "#";
				cycles += checkCycleInMap(gridCopy, startingPosition);
			}
		}
	}
	return cycles;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const grid = processData(data);
	const startingPosition = getStartingPosition(grid);
	const results = countPossibleCycles(grid, startingPosition);
	console.log(results);
};

main();
