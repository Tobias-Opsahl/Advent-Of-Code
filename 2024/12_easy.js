import fs from "fs/promises";

const inputFilePath = "inputs/12_input.txt";

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

const walkGarden = (map, y, x, value, visitedGrid, visitedList) => {
	if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
		// OOB
		return;
	}
	if (visitedGrid[y][x]) {
		return;
	}
	const newValue = map[y][x];
	if (newValue !== value) {
		// Not the same garden
		return;
	}

	visitedGrid[y][x] = true;
	visitedList.push([y, x]);

	walkGarden(map, y - 1, x, value, visitedGrid, visitedList);
	walkGarden(map, y, x + 1, value, visitedGrid, visitedList);
	walkGarden(map, y + 1, x, value, visitedGrid, visitedList);
	walkGarden(map, y, x - 1, value, visitedGrid, visitedList);
};

const makeVisitedGrid = (height, width) => {
	const visited = [];
	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(false);
		}
		visited.push(row);
	}
	return visited;
};

const getGardenCoordinates = (map, y, x) => {
	let visitedGrid = makeVisitedGrid(map.length, map[0].length);
	let visitedList = [];
	const value = map[y][x];
	walkGarden(map, y, x, value, visitedGrid, visitedList);
	return [visitedGrid, visitedList];
};

const checkNeighbour = (visitedGrid, y, x) => {
	if (x < 0 || x >= visitedGrid[0].length || y < 0 || y >= visitedGrid.length) {
		// OOB
		return 1;
	}
	if (!visitedGrid[y][x]) {
		return 1;
	}
	return 0;
};

const checkNeighbours = (visitedGrid, y, x) => {
	let perimeter = 0;
	perimeter += checkNeighbour(visitedGrid, y - 1, x);
	perimeter += checkNeighbour(visitedGrid, y, x + 1);
	perimeter += checkNeighbour(visitedGrid, y + 1, x);
	perimeter += checkNeighbour(visitedGrid, y, x - 1);
	return perimeter;
};

const calculateFenceCost = (visitedGrid, visitedList) => {
	const area = visitedList.length;
	let perimeter = 0;
	for (const [y, x] of visitedList) {
		perimeter += checkNeighbours(visitedGrid, y, x);
	}
	const cost = area * perimeter;
	return cost;
};

const findGardens = (map) => {
	const totalVisited = makeVisitedGrid(map.length, map[0].length);
	let cost = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (totalVisited[i][j]) {
				continue;
			}
			const [visitedGrid, visitedList] = getGardenCoordinates(map, i, j);
			cost += calculateFenceCost(visitedGrid, visitedList);
			for (const [y, x] of visitedList) {
				totalVisited[y][x] = true;
			}
		}
	}
	return cost;
};

// eslint-disable-next-line no-unused-vars
const printMap = (map) => {
	map.forEach((row) => {
		const line = row.join("");
		console.log(line);
	});
	console.log();
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const map = processData(data);
	const results = findGardens(map);
	console.log(results);
};

main();
