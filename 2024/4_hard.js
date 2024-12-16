import fs from "fs/promises";

const inputFilePath = "inputs/4_input.txt";

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

const countXmasGrid = (grid) => {
	// Expectes a 3 x 3 grid, checks if there is an X-mas in grid.
	if (!(grid[1][1] === "A")) {
		return 0;
	}
	if (!((grid[0][0] === "M" && grid[2][2] === "S") || (grid[0][0] === "S" && grid[2][2] === "M"))) {
		return 0;
	}
	if (!((grid[2][0] === "M" && grid[0][2] === "S") || (grid[2][0] === "S" && grid[0][2] === "M"))) {
		return 0;
	}
	return 1;
};

const makeSubGrid = (wordSearch, startRow, startCol, gridSize = 3) => {
	const grid = wordSearch.slice(startRow, startRow + gridSize).map((row) => row.slice(startCol, startCol + gridSize));
	return grid;
};

const countXmasFull = (wordSearch, gridSize = 3) => {
	let sum = 0;
	const nRows = wordSearch.length;
	const nCols = wordSearch[0].length;
	for (let i = 0; i < nRows - gridSize + 1; i++) {
		for (let j = 0; j < nCols - gridSize + 1; j++) {
			const grid = makeSubGrid(wordSearch, i, j, gridSize);
			sum += countXmasGrid(grid);
		}
	}
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const wordSearch = processData(data);
	const totalCount = countXmasFull(wordSearch);
	console.log(totalCount);
};

main();
