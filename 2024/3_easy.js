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

const main = async () => {
	const data = await readInput(inputFilePath);
	const regex = /mul\(\d{1,3},\d{1,3}\)/g;
	const matches = [...data.matchAll(regex)];
	const muls = matches.map((item) => {
		return item[0];
	});
	const product = muls.reduce((sum, item) => {
		return sum + multiplyMul(item);
	}, 0);
	console.log(product);
};

main();
