import fs from "fs/promises";
import Heap from "heap";

const inputFilePath = "inputs/18_input.txt";

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
		const words = line.split(",").map(Number);
		processedData.push([words[1], words[0]]);
	});
	return processedData;
};

const search = (map, height, width, bfs = true) => {
	let count = 0;
	const start = [0, 0];
	const end = [height - 1, width - 1];
	const visited = Array.from({ length: height }, () => Array(width).fill(false));
	visited[start[0]][start[1]] = 0;
	const queue = [[...start, 0]];
	const directions = [
		[0, 1], // Right
		[1, 0], // Down
		[0, -1], // Left
		[-1, 0], // Up
	];

	while (queue.length > 0) {
		count++;
		let y, x, distance;
		if (bfs) {
			[y, x, distance] = queue.shift();
		} else {
			// Depth first search, does not work in this task.
			[y, x, distance] = queue.pop();
		}
		visited[y][x] = distance;
		if (y === end[0] && x === end[1]) {
			return [distance, count];
		}

		for (const [dy, dx] of directions) {
			const nextY = y + dy;
			const nextX = x + dx;

			if (nextY >= height || nextY < 0 || nextX >= width || nextX < 0) {
				continue; // Out-of-bounds
			}

			if (map[nextY][nextX] === "#" || visited[nextY][nextX]) {
				continue; // Wall or visited
			}
			visited[nextY][nextX] = true;
			queue.push([nextY, nextX, distance + 1]);
		}
	}
	return [-1, count];
};

const dijkstra = (map, height, width) => {
	return aStar(map, height, width, "none");
};

const aStar = (map, height, width, heuristic = "manhattan") => {
	heuristic = heuristic.toLowerCase().trim();
	let count = 0;
	const start = [0, 0];
	const end = [height - 1, width - 1];
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
		count++;
		const [, [y, x]] = pq.pop();

		if (y === end[0] && x === end[1]) {
			// printMap(map, distances);
			return [distances[end[0]][end[1]], count];
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
	return [-1, count];
};

const makeMap = (bytes, nBytes, height, width) => {
	const map = Array.from({ length: height }, () => Array(width).fill("."));
	bytes.slice(0, nBytes).forEach(([y, x]) => {
		map[y][x] = "#";
	});
	return map;
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
	const height = 71;
	const width = 71;
	const nBytes = 1024;
	const data = await readInput(inputFilePath);
	const bytes = processData(data);
	const map = makeMap(bytes, nBytes, height, width);
	let distance, count;
	[distance, count] = search(map, height, width, true);
	console.log(`Visited tiles with BFS: ${count} (distance ${distance})`);
	[distance, count] = dijkstra(map, height, width);
	console.log(`Visited tiles with Dijkstra: ${count} (distance ${distance})`);
	[distance, count] = aStar(map, height, width, "l1");
	console.log(`Visited tiles with A-star (manhattan): ${count} (distance ${distance})`);
	[distance, count] = aStar(map, height, width, "l2");
	console.log(`Visited tiles with A-star (euclidian): ${count} (distance ${distance})`);
	[distance, count] = aStar(map, height, width, "linfinity");
	console.log(`Visited tiles with A-star (l-infinity): ${count} (distance ${distance})`);
};

main();
