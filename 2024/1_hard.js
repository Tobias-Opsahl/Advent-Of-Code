import fs from "fs/promises";

const inputFilePath = "inputs/1_input.txt";

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
	const leftList = [];
	const rightList = [];
	lines.forEach((line) => {
		const words = line.split(/\s+/).map(Number);
		leftList.push(words[0]);
		rightList.push(words[1]);
	});
	return [leftList, rightList];
};

const getListCounts = (list) => {
	const counts = new Map();
	list.forEach((item) => {
		counts.set(item, (counts.get(item) ?? 0) + 1);
	});
	return counts;
};

const getSimilarityScore = (leftList, rightCounts) => {
	let sum = 0;
	leftList.forEach((item) => {
		sum += item * (rightCounts.get(item) ?? 0);
	});
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const [leftList, rightList] = processData(data);
	const rightCounts = getListCounts(rightList);
	const similarityScore = getSimilarityScore(leftList, rightCounts);
	console.log(similarityScore);
};

main();
