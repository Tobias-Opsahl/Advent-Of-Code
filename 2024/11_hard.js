import fs from "fs/promises";

const inputFilePath = "inputs/11_input.txt";

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
	const stones = data.split(/\s+/).map(Number);
	return stones;
};

const makeStoneMap = (stones) => {
	const stoneMap = new Map();
	for (const stone of stones) {
		stoneMap.set(stone, (stoneMap.get(stone) ?? 0) + 1);
	}
	return stoneMap;
};

const blink = (stoneMap) => {
	const newStoneMap = new Map();
	for (const [stone, count] of stoneMap) {
		if (stone == 0) {
			newStoneMap.set(1, (newStoneMap.get(1) ?? 0) + count);
			continue;
		}
		const numDigits = stone.toString().length;
		if (numDigits % 2 == 0) {
			let firstHalf = stone.toString().slice(0, numDigits / 2);
			let secondHalf = stone.toString().slice(numDigits / 2, numDigits);
			firstHalf = Number(firstHalf);
			secondHalf = Number(secondHalf);
			newStoneMap.set(firstHalf, (newStoneMap.get(firstHalf) ?? 0) + count);
			newStoneMap.set(secondHalf, (newStoneMap.get(secondHalf) ?? 0) + count);
			continue;
		}
		newStoneMap.set(stone * 2024, (newStoneMap.get(stone * 2024) ?? 0) + count);
	}
	return newStoneMap;
};

const blink75times = (stones) => {
	for (let i = 0; i < 75; i++) {
		console.log(i, countStoneMap(stones), new Set(stones).size);
		stones = blink(stones);
	}
	return stones;
};

const countStoneMap = (stoneMap) => {
	let sum = 0;
	for (const count of stoneMap.values()) {
		sum += count;
	}
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	let stones = processData(data);
	let stoneMap = makeStoneMap(stones);
	stones = blink75times(stoneMap);
	const results = countStoneMap(stones);
	console.log(results);
};

main();
