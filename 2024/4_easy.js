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

const countXmasSingleLine = (lineArray) => {
	const regex1 = /XMAS/g;
	const regex2 = /SAMX/g;
	const line = lineArray.join("");
	const xmasMatches = [...line.matchAll(regex1)].length;
	const samxMatches = [...line.matchAll(regex2)].length;
	return xmasMatches + samxMatches;
};

const countRows = (wordSearch) => {
	const count = wordSearch.reduce((sum, row) => {
		return sum + countXmasSingleLine(row);
	}, 0);
	return count;
};

const countColumns = (wordSearch) => {
	let sum = 0;
	for (let i = 0; i < wordSearch[0].length; i++) {
		const column = wordSearch.map((line) => line[i]);
		sum += countXmasSingleLine(column);
	}
	return sum;
};

const countMainDiagonals = (wordSearch) => {
	// Counts the two main diagonals
	const n = Math.min(
		wordSearch[0].length,
		wordSearch.map((line) => line[0]).length
	);  // In case of asymmetric matrix, which is not the case
	const diagonal1 = [];
	const diagonal2 = [];
	for (let i = 0; i < n; i++) {
		diagonal1.push(wordSearch[i][i]);
		diagonal2.push(wordSearch[i][n - 1 - i]);
	}
	return countXmasSingleLine(diagonal1) + countXmasSingleLine(diagonal2);
}

const countDiagonals = (wordSearch, rowOffset, colOffset) => {
	// Generic function for counting one fourth of the diagonals, excluding the
	// two longest diagonals. If the offsets are false, will iterate from the
	// top left to the middle. If `rowOffset` is true, will iterate from right,
	// and if `colOffset` is true, will iterate up.
	const n = Math.min(
		wordSearch[0].length,
		wordSearch.map((line) => line[0]).length
	);  // In case of asymmetric matrix, which is not the case
	let rowStart, rowSign, colStart, colSign;
	if (rowOffset) {
		rowStart = n - 1;
		rowSign = -1;
	} else {
		rowStart = 0;
		rowSign = 1;
	}
	if (colOffset) {
		colStart = n - 1;
		colSign = -1;
	} else {
		colStart = 0;
		colSign = 1;
	}
	let sum = 0;
	for (let i = 0; i < n - 1; i++) {
		const diagonal = [];
		for (let j = 0; j < i + 1; j++) {
			diagonal.push(
				wordSearch[rowStart + rowSign * j][colStart + colSign * (i - j)]
			);
		}
		sum += countXmasSingleLine(diagonal);
	}
	return sum;
};

const countDiagonalsLeftDown = (wordSearch) => {
	return countDiagonals(wordSearch, false, false);
};

const countDiagonalsRightDown = (wordSearch) => {
	return countDiagonals(wordSearch, false, true);
};

const countDiagonalsLeftUp = (wordSearch) => {
	return countDiagonals(wordSearch, true, false);
};

const countDiagonalsRightUp = (wordSearch) => {
	return countDiagonals(wordSearch, true, true);
};

const countXmasFull = (wordSearch) => {
	let sum = 0;
	sum += countRows(wordSearch);
	sum += countColumns(wordSearch);
	sum += countMainDiagonals(wordSearch);
	sum += countDiagonalsLeftDown(wordSearch);
	sum += countDiagonalsRightDown(wordSearch);
	sum += countDiagonalsLeftUp(wordSearch);
	sum += countDiagonalsRightUp(wordSearch);
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const wordSearch = processData(data);
	const totalCount = countXmasFull(wordSearch);
	console.log(totalCount);
};

main();
