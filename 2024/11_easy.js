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

const blink = (stones) => {
	const newStones = [];
	for (let i = 0; i < stones.length; i++) {
		const stone = stones[i];
		if (stone == 0) {
			newStones.push(1);
			continue;
		}
		const numDigits = stone.toString().length;
		if (numDigits % 2 == 0) {
			const firstHalf = stone.toString().slice(0, numDigits / 2);
			const secondHalf = stone.toString().slice(numDigits / 2, numDigits);
			newStones.push(Number(firstHalf));
			newStones.push(Number(secondHalf));
			continue;
		}
		newStones.push(stone * 2024);
	}
	return newStones;
}

const blink25times = (stones) => {
	for (let i = 0; i < 25; i++) {
		stones = blink(stones);
	}
	return stones;
}

const processData = (data) => {
	const stones = data.split(/\s+/).map(Number);
	return stones;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	let stones = processData(data);
	stones = blink25times(stones);
	console.log(stones.length);
};

main();
