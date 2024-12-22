import fs from "fs/promises";

const inputFilePath = "inputs/22_input_alt.txt";

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

const getPrices = (initialNumbers) => {
	const prices = []
	const priceChanges = [];
	for (let number of initialNumbers) {
		const price = [];
		const priceChange = [];
		let lastDigit = Math.abs(number % 10);
		let change = 10;  // No valid change first time
		price.push(lastDigit);
		priceChange.push(change);
		for (let i = 0; i < 2000; i++) {
			number = getNextNumber(number);
			lastDigit = Math.abs(number % 10);
			change = lastDigit - price.at(-1);
			price.push(lastDigit);
			priceChange.push(change);
		}
		prices.push(price);
		priceChanges.push(priceChange);
	}
	return [prices, priceChanges];
}

const calculateSingleSalePrice = (prices, priceChanges, sequence) => {
	for (let i = 0; i < prices.length - sequence.length + 1; i++) {
		let j = 0;
		while (j < sequence.length && sequence[j] === priceChanges[i + j]) {
			j++;
		}
		if (j === sequence.length) {
			return prices[i + sequence.length - 1];
		}
	}
	return 0;  // No match
}

const calculateTotalSalePrice = (prices, priceChanges, sequence) => {
	let salePrice = 0;
	for (let i = 0; i < prices.length; i++) {
		salePrice += calculateSingleSalePrice(prices[i], priceChanges[i], sequence);
	}
	return salePrice;
};

const calculateMaximumPrice = (prices, priceChanges) => {
	let maxPrice = 0;
	let bestSequence;
	for (let a = -9; a <= 9; a++) {
		console.log(`a = ${a}`);
		for (let b = -9; b <= 9; b++) {
			// console.log(`b = ${b}`);
			for (let c = -9; c <= 9; c++) {
				for (let d = -9; d <= 9; d++) {
					const sequence = [a, b, c, d];
					const salePrice = calculateTotalSalePrice(prices, priceChanges, sequence);
					if (salePrice >= maxPrice) {
						maxPrice = salePrice;
						bestSequence = sequence;
					}
				}
			}
		}
	}
	console.log(maxPrice, bestSequence);
	return maxPrice;
}


const main = async () => {
	"// eslint-disable-next-line no-unused-vars";
	const data = await readInput(inputFilePath);
	const initialNumbers = processData(data);
	const [prices, priceChanges] = getPrices(initialNumbers);
	const results = calculateMaximumPrice(prices, priceChanges);
	console.log(results);
};

main();
