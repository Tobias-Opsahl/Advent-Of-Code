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
	return {sums: sumsArray, numbersArray: numbersArray};
};

const getNextOperants = (operants) => {
	for (let i = 0; i < operants.length; i++) {
		if (operants[i] === 0) {
			operants[i] = 1;
			return operants;
		}
		operants[i] = 0;
	}
	return operants;
}

const checkExhausted = (operants) => {
	for (let i = 0; i < operants.length; i++) {
		if (operants[i] === 0) {
			return false;
		}
	}
	return true;
}

const checkSingleTest = (sum, numbers) => {
	let operants = Array(numbers.length - 1).fill(0);
	let exhausted = false;
	while (!exhausted) {
		let candidateSum = numbers[0];
		for (let i = 0; i < operants.length; i++) {
			if (operants[i] === 0) {  // Plus
				candidateSum = candidateSum + numbers[i + 1];
			} else if (operants[i] === 1) {
				candidateSum = candidateSum * numbers[i + 1];
			}
		}
		if (candidateSum === sum) {
			return sum;
		}
		exhausted = checkExhausted(operants);
		operants = getNextOperants(operants);
	}
	return 0;
}

const checkAllTests = (sums, numbersArray) => {
	let totalSum = 0;
	for (let i = 0; i < sums.length; i++) {
		totalSum += checkSingleTest(sums[i], numbersArray[i]);
	}
	return totalSum;
}

const main = async () => {
	const data = await readInput(inputFilePath);
	const processedData = processData(data);
	const sums = processedData.sums;
	const numbersArray = processedData.numbersArray;
	const results = checkAllTests(sums, numbersArray);
	console.log(results);
};

main();
