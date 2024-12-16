import fs from "fs/promises";

const inputFilePath = "inputs/7_input.txt";

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
	const sumsArray = [];
	const numbersArray = [];
	lines.forEach((line) => {
		const [sum, numbers] = line.split(":");
		sumsArray.push(parseInt(sum, 10));
		numbersArray.push(numbers.trim().split(/\s+/).map(Number));
	});
	return { sums: sumsArray, numbersArray: numbersArray };
};

const checkSingleTestHelper = (sum, numbers, accumulated, step) => {
	if (step === numbers.length) {
		if (sum === accumulated) {
			return sum;
		}
		return 0;
	}
	const addBranch = checkSingleTestHelper(sum, numbers, accumulated + numbers[step], step + 1);
	const multiplicationBranch = checkSingleTestHelper(sum, numbers, accumulated * numbers[step], step + 1);

	return Math.max(addBranch, multiplicationBranch);
};

const checkSingleTest = (sum, numbers) => {
	return checkSingleTestHelper(sum, numbers, 0, 0);
};

const checkAllTests = (sums, numbersArray) => {
	let totalSum = 0;
	for (let i = 0; i < sums.length; i++) {
		totalSum += checkSingleTest(sums[i], numbersArray[i]);
	}
	return totalSum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const processedData = processData(data);
	const sums = processedData.sums;
	const numbersArray = processedData.numbersArray;
	const results = checkAllTests(sums, numbersArray);
	console.log(results);
};

main();
