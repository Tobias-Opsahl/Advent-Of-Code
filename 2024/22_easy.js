import fs from "fs/promises";

const inputFilePath = "inputs/22_input.txt";

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
		processedData.push(Number(line.trim()));
	});
	return processedData;
};

const modulo = (n, m) => {
	return ((n % m) + m) % m;
};


const mix = (value, secretNumber) => {
	return value ^ secretNumber;
}

const prune = (secretNumber) => {
	return modulo(secretNumber, 16777216);
}


const getNextNumber = (secretNumber) => {
	// Step 1
	let value = secretNumber * 64;
	secretNumber = prune(mix(value, secretNumber));
	// Step 2
	value = Math.floor(secretNumber / 32);
	secretNumber = prune(mix(value, secretNumber));
	// Step 3
	value = secretNumber * 2048;
	secretNumber = prune(mix(value, secretNumber));
	return secretNumber;
}

const getSumOfNumbers = (initialNumbers) => {
	let sum = 0;
	for (let number of initialNumbers) {
		// console.log(`Initial number ${number}`);
		for (let i = 0; i < 2000; i++) {
			number = getNextNumber(number);
		}
		// console.log(`2000th number ${number}`);
		sum += number;
	}
	return sum;
}

const main = async () => {
	"// eslint-disable-next-line no-unused-vars";
	const data = await readInput(inputFilePath);
	const initialNumbers = processData(data);
	const results = getSumOfNumbers(initialNumbers);
	console.log(results);
};

main();
