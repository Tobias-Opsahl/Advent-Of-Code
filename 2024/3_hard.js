import fs from "fs/promises";

const inputFilePath = "inputs/3_input.txt";

const readInput = async (filePath) => {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return data;
	} catch (err) {
		console.error("Error reading the file:", err);
		throw err;
	}
};

const multiplyMul = (mul) => {
	const start = mul.indexOf("(") + 1;
	const end = mul.indexOf(")");
	const content = mul.slice(start, end);
	const numbers = content.split(",").map(Number);
	return numbers[0] * numbers[1];
};

const findMuls = (instructions) => {
	const regex = /mul\(\d{1,3},\d{1,3}\)/g;
	const matches = [...instructions.matchAll(regex)];
	const muls = matches.map((item) => {
		return item[0];
	});
	return muls;
};

const findDos = (instructions) => {
	// Get content in the middle of do() - don't() blocks
	const regex = /do\(\).*?don't\(\)/gs;
	const matches = [...instructions.matchAll(regex)];
	const dos = matches.map((item) => {
		return item[0];
	});
	// Get the content for the first part, until the first don't()
	let index = instructions.indexOf("don't()");
	if (index != -1) {
		dos.push(instructions.slice(0, index + 7));
	}
	// Get the last part, from do() to the end (if there is no don't() there
	index = instructions.lastIndexOf("do()");
	if (index != -1) {
		const text = instructions.slice(index, instructions.length);
		if (!text.includes("don't()")) {
			dos.push(text);
		}
	}
	return dos;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const dos = findDos(data);
	const product = dos.reduce((outerSum, instructions) => {
		const muls = findMuls(instructions);
		const sum = muls.reduce((sum, item) => {
			return sum + multiplyMul(item);
		}, 0);
		return outerSum + sum;
	}, 0);
	console.log(product);
};

main();
