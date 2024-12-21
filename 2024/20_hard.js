import fs from "fs/promises";
import Heap from "heap";

const inputFilePath = "inputs/20_input.txt";

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

const getPosition = (map, pos) => {
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === pos) {
				return [i, j];
			}
		}
	}
	throw new Error(`No ${pos} in map. `);
}

const getStartPosition = (map) => {
	return getPosition(map, "S");
};

const getEndPosition = (map) => {
	return getPosition(map, "E");
};


const aStar = (map, heuristic = "manhattan", walls=["#"]) => {
	const height = map.length;
	const width = map[0].length;
	heuristic = heuristic.toLowerCase().trim();
	const start = getStartPosition(map);
	const end = getEndPosition(map);
	const distances = Array.from({ length: height }, () => Array(width).fill(Infinity));
	const pq = new Heap((a, b) => a[0] - b[0]);
	distances[start[0]][start[1]] = 0;
	pq.push([0, start]);

	const directions = [
		[0, 1], // Right
		[1, 0], // Down
		[0, -1], // Left
		[-1, 0], // Up
	];

	const getHeuristic = (y, x) => {
		const [goalY, goalX] = end;
		if (heuristic === "manhattan" || heuristic === "l1") {
			return Math.abs(goalY - y) + Math.abs(goalX - x);
		} else if (heuristic === "euclidean" || heuristic === "l2") {
			return Math.floor(Math.sqrt((goalY - y) ** 2 + (goalX - x) ** 2));
		} else if (heuristic === "max" || heuristic === "linfinity") {
			return Math.max(Math.abs(goalY - y), Math.abs(goalX - x));
		}
		return 0; // No heuristic
	};

	while (!pq.empty()) {
		const [, [y, x]] = pq.pop();

		if (y === end[0] && x === end[1]) {
			// printMap(map, distances);
			return distances;
		}
		
		for (const [dy, dx] of directions) {
			const nextY = y + dy;
			const nextX = x + dx;
			
			if (nextY >= height || nextY < 0 || nextX >= width || nextX < 0) {
				continue; // Out-of-bounds
			}
			
			if (walls.includes(map[nextY][nextX])) {
				continue; // Wall
			}
			const g = distances[y][x] + 1;
			const h = getHeuristic(nextY, nextX);
			const f = g + h;
			if (g < distances[nextY][nextX]) {
				distances[nextY][nextX] = g;
				pq.push([f, [nextY, nextX]]);
			}
		}
	}
	return -1;
};

const checkShortCut = (map, distances, y, x, shortcutCounts) => {
	if (map[y][x] === "#") {
		return shortcutCounts;
	}
	if (distances[y][x] === Infinity) {
		console.log("!", y, x);
	}
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] !== "#" && distances[i][j] === Infinity) {
				console.log("!", i, j);  // Ensure everything is visited
			}
			if (map[i][j] === "#") {
				continue;
			}
			if (y === i && x === j) {
				continue;
			}
			const manhattanDistance = Math.abs(y - i) + Math.abs(x - j);
			if (manhattanDistance > 20) {
				continue;
			}
			if (distances[i][j] - distances[y][x] < 100) {
				continue;
			}
			const shortcutDistance = manhattanDistance;
			if (shortcutDistance === -1) {
				continue;
			}
			const stepsSaved = distances[i][j] - distances[y][x] - shortcutDistance;
			if (shortcutDistance <= 20 && stepsSaved >= 100) {
				shortcutCounts.set(stepsSaved, (shortcutCounts.get(stepsSaved) ?? 0) + 1);
			}
		}
	}
	return shortcutCounts;
}

const checkShortCuts = (map, heuristic="manhattan") => {
	let shortcutCounts = new Map();
	const distances = aStar(map, heuristic);
	const start = getStartPosition(map);
	const end = getEndPosition(map);
	map[start[0]][start[1]] = ".";
	map[end[0]][end[1]] = ".";
	for (let i = 1; i < map.length - 1; i++) {
		for (let j = 1; j < map[0].length - 1; j++) {
			shortcutCounts = checkShortCut(map, distances, i, j, shortcutCounts);
		}
	}
	shortcutCounts = new Map([...shortcutCounts.entries()].sort((a, b) => a[0] - b[0]));
	console.log(shortcutCounts);
	let sum = 0;
	for (let value of shortcutCounts.values()) {
		sum += value;
	}
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const map = processData(data);
	let results = checkShortCuts(map);
	console.log("Results: ", results);
};

main();
