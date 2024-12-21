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


const aStar = (map, heuristic = "manhattan") => {
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
			return distances[end[0]][end[1]];
		}
		
		for (const [dy, dx] of directions) {
			const nextY = y + dy;
			const nextX = x + dx;
			
			if (nextY >= height || nextY < 0 || nextX >= width || nextX < 0) {
				continue; // Out-of-bounds
			}
			
			if (map[nextY][nextX] === "#") {
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

const checkShortCuts = (map, heuristic="manhattan") => {
	const shortcutCounts = new Map();
	let count = 0;
	const totalSteps = aStar(map, heuristic);
	const maxSteps = totalSteps - 100;
	for (let i = 1; i < map.length - 1; i++) {
		for (let j = 1; j < map[0].length - 1; j++) {
			if (map[i][j] !== "#") {
				continue;
			}
			const newMap = map.map((row) => [...row]);
			newMap[i][j] = ".";
			const steps = aStar(newMap, heuristic, maxSteps);
			if (steps !== -1 && steps <= maxSteps) {
				const stepsSaved = totalSteps - steps;
				shortcutCounts.set(stepsSaved, (shortcutCounts.get(stepsSaved) ?? 0) + 1);
				count++;
			}
		}
	}
	// console.log(shortcutCounts);
	return count;
};

// eslint-disable-next-line no-unused-vars
const printMap = (map, distances) => {
	const newMap = [];
	for (let i = 0; i < map.length; i++) {
		const row = [];
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === "#") {
				row.push("#");
			} else if (distances[i][j] === Infinity) {
				row.push(".");
			} else {
				row.push("O");
			}
		}
		newMap.push(row);
	}
	newMap.forEach((row) => {
		let line = row.join("");
		console.log(line);
	});
	console.log();
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const map = processData(data);
	const results = checkShortCuts(map);
	console.log("Results: ", results);
};

main();
