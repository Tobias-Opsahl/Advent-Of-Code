import fs from "fs/promises";

const inputFilePath = "inputs/16_input.txt";

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

const modulo = (n, m) => {
	return ((n % m) + m) % m;
};

const getNextPosition = (movement, y, x) => {
	switch (movement) {
		case 0: // Up
			return [y - 1, x];
		case 1: // Right
			return [y, x + 1];
		case 2: // Down
			return [y + 1, x];
		case 3: // Left
			return [y, x - 1];
		default:
			throw new Error(`Invalid movement ${movement}. `);
	}
};

const getReindeerPosition = (map) => {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "S") {
				return [i, j];
			}
		}
	}
	throw new Error(`No Robot. `);
};

const markVisited = (v1, v2) => {
	for (let i = 0; i < v1.length; i++) {
		for (let j = 0; j < v1[0].length; j++) {
			if (v2[i][j] > -1) {
				v1[i][j] = 1;
			}
		}
	}
	return v1;
};

const countVisited = (visited) => {
	let count = 0;
	for (let i = 0; i < visited.length; i++) {
		for (let j = 0; j < visited[0].length; j++) {
			if (visited[i][j] > -1) {
				count += 1;
			}
		}
	}
	console.log("Best Visited Count: ", count);
};

const dfs = (maze, y, x, rotation, visited, cost, minCost, bestVisited, bestVisitedTotal) => {
	// visited is total visited. bestVisited are backtracked after no solution
	// is found. bestVisitedTotal is for counting the different tiles in bestVisited.
	if (minCost !== -1 && minCost < cost) {
		return 10000000000;
	}
	if (maze[y][x] === "#") {
		return 10000000000;
	}
	if (visited[y][x] !== -1 && visited[y][x] + 1001 < cost) {
		// Visit with a buffer of 1000. One can have visitied a place before, but
		// with a worse rotation.
		return 10000000000;
	}
	if (visited[y][x] === -1) {
		visited[y][x] = cost;
	}
	visited[y][x] = Math.min(cost, visited[y][x]);
	bestVisited[y][x] = 1;
	if (maze[y][x] === "E") {
		markVisited(bestVisitedTotal, bestVisited);
		countVisited(bestVisitedTotal);
		// printMaze(maze, bestVisitedTotal);
		return cost;
	}
	const rotation1 = rotation;
	const rotation2 = modulo(rotation - 1, 4);
	const rotation3 = modulo(rotation + 1, 4);
	const [y1, x1] = getNextPosition(rotation1, y, x);
	const [y2, x2] = getNextPosition(rotation2, y, x);
	const [y3, x3] = getNextPosition(rotation3, y, x);
	const cost1 = dfs(maze, y1, x1, rotation1, visited, cost + 1, minCost, bestVisited, bestVisitedTotal);
	if (minCost === -1 || cost1 < minCost) {
		minCost = cost1;
	}
	const cost2 = dfs(maze, y2, x2, rotation2, visited, cost + 1001, minCost, bestVisited, bestVisitedTotal);
	if (minCost === -1 || cost2 < minCost) {
		minCost = cost2;
	}
	const cost3 = dfs(maze, y3, x3, rotation3, visited, cost + 1001, minCost, bestVisited, bestVisitedTotal);
	if (minCost === -1 || cost3 < minCost) {
		minCost = cost3;
	}
	// visited[y][x] = -1;  // Backtracking everything is too slow for full input
	bestVisited[y][x] = -1;
	return Math.min(cost1, cost2, cost3);
};

const makeVisitedArray = (height, width) => {
	const visited = [];
	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(-1);
		}
		visited.push(row);
	}
	return visited;
};

const solveMaze = (maze, minCost) => {
	const [y, x] = getReindeerPosition(maze);
	const rotation = 1;
	const visited = makeVisitedArray(maze.length, maze[0].length);
	const bestVisited = makeVisitedArray(maze.length, maze[0].length);
	const bestVisitedTotal = makeVisitedArray(maze.length, maze[0].length);
	const results = dfs(maze, y, x, rotation, visited, 0, minCost, bestVisited, bestVisitedTotal);
	return results;
};

// eslint-disable-next-line no-unused-vars
const printMaze = (map, visited) => {
	const printArray = [];
	for (let i = 0; i < map.length; i++) {
		const row = [];
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "#") {
				row.push("#");
			} else if (visited[i][j] === -1) {
				row.push(".");
			} else {
				row.push("O");
			}
		}
		printArray.push(row);
	}
	printArray.forEach((row) => {
		const line = row.join("");
		console.log(line);
	});
	console.log();
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const maze = processData(data);
	const results = solveMaze(maze, 98484);
	// const results = solveMaze(maze, 11050);
	console.log("Results: ", results);
};

main();
