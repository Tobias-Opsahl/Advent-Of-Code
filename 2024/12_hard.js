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

const checkNeighbour = (visitedGrid, y, x, fenceList) => {
	if (
		x < 0 ||
		x >= visitedGrid[0].length ||
		y < 0 ||
		y >= visitedGrid.length
	) {
		fenceList.push([y, x]);
		return fenceList;
	}
	if (!visitedGrid[y][x]) {
		fenceList.push([y, x]);
	}
	return fenceList;
};

const checkNeighbours = (visitedGrid, y, x, fenceList) => {
	fenceList = checkNeighbour(visitedGrid, y - 1, x, fenceList);
	fenceList = checkNeighbour(visitedGrid, y, x + 1, fenceList);
	fenceList = checkNeighbour(visitedGrid, y + 1, x, fenceList);
	fenceList = checkNeighbour(visitedGrid, y, x - 1, fenceList);
	fenceList = checkNeighbour(visitedGrid, y - 1, x + 1, fenceList);
	fenceList = checkNeighbour(visitedGrid, y + 1, x + 1, fenceList);
	fenceList = checkNeighbour(visitedGrid, y + 1, x - 1, fenceList);
	fenceList = checkNeighbour(visitedGrid, y - 1, x - 1, fenceList);

	return fenceList;
};

const checkIfVisited = (visitedGrid, y, x) => {
	if (
		x < 0 ||
		x >= visitedGrid[0].length ||
		y < 0 ||
		y >= visitedGrid.length
	) {
		return 0;
	}
	if (visitedGrid[y][x]) {
		return 1;
	}
	return 0;
};

const checkCorner = (visitedGrid, y, x) => {
	const up = checkIfVisited(visitedGrid, y - 1, x);
	const right = checkIfVisited(visitedGrid, y, x + 1);
	const down = checkIfVisited(visitedGrid, y + 1, x);
	const left = checkIfVisited(visitedGrid, y, x - 1);
	const upRight = checkIfVisited(visitedGrid, y - 1, x + 1);
	const downRight = checkIfVisited(visitedGrid, y + 1, x + 1);
	const downLeft = checkIfVisited(visitedGrid, y + 1, x - 1);
	const upLeft = checkIfVisited(visitedGrid, y - 1, x - 1);
	const flat = up + right + down + left;
	const diag = upRight + downRight + downLeft + upLeft;
	if (flat === 4) {
		return 4;
	}
	if (flat === 3) {
		return 2;
	}
	if (flat === 2) {
		if (up === down) {
			return 0;
		}
		if (
			(up === 1 && right === 1 && downLeft === 1) ||
			(right === 1 && down === 1 && upLeft === 1) ||
			(down === 1 && left === 1 && upRight === 1) ||
			(left === 1 && up === 1 && downRight === 1)
		) {
			return 2;
		}
		return 1;
	}
	if (flat === 0) {
		return diag;
	}
	// flat === 1
	if (up) {
		return downRight + downLeft;
	}
	if (right) {
		return downLeft + upLeft;
	}
	if (down) {
		return upLeft + upRight;
	}
	if (left) {
		return upRight + downRight;
	}
};

const countCorners = (visitedGrid, fenceList) => {
	let corners = 0;
	for (const [y, x] of fenceList) {
		corners += checkCorner(visitedGrid, y, x);
		// console.log("   ", corners, "[", y, x, "]");
	}
	return corners;
};

const calculateFenceCost = (visitedGrid, visitedList) => {
	const area = visitedList.length;
	let fenceList = [];
	for (const [y, x] of visitedList) {
		fenceList = checkNeighbours(visitedGrid, y, x, fenceList);
	}
	// Remove duplicates
	const fenceSet = new Set(fenceList.map((item) => item.join(",")));
	const uniqueFenceList = Array.from(fenceSet).map((item) =>
		item.split(",").map(Number)
	);
	const corners = countCorners(visitedGrid, uniqueFenceList);
	const cost = area * corners;
	console.log(corners, cost);
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
