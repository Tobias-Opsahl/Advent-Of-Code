import fs from "fs/promises";

const inputFilePath = "inputs/10_input.txt";

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
		const words = line.split("").map(Number);
		processedData.push(words);
	});
	return processedData;
};

const walkTrailHead = (map, y, x, prevValue, visited) => {
	if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
		// OOB
		return 0;
	}
	if (visited[y][x]) {
		return 0;
	}
	const value = map[y][x];
	if (value - prevValue !== 1) {
		// Hill not incremented by one
		return 0;
	}

	// visited[y][x] = true;
	// Does not need visited at all, but I am too lazy to remove the variable
	if (value === 9) {
		return 1;
	}
	const upPath = walkTrailHead(map, y - 1, x, value, visited);
	const rightPath = walkTrailHead(map, y, x + 1, value, visited);
	const downPath = walkTrailHead(map, y + 1, x, value, visited);
	const leftPath = walkTrailHead(map, y, x - 1, value, visited);
	// visited[y][x] = false;  // backtracking
	return upPath + rightPath + downPath + leftPath;
};

const makeVisitedArray = (height, width) => {
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

const getTrailHeadScore = (map, y, x) => {
	let visited = makeVisitedArray(map.length, map[0].length);
	let score = walkTrailHead(map, y, x, -1, visited);
	return score;
};

const getAllScores = (map) => {
	let sum = 0;
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] === 0) {
				const trailHeadScore = getTrailHeadScore(map, i, j);
				sum += trailHeadScore;
			}
		}
	}
	return sum;
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
	const results = getAllScores(map);
	console.log(results);
};

main();
