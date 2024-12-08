import fs from "fs/promises";

const inputFilePath = "inputs/_input_small.txt";

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
		const words = line.split(/\s+/).map(Number);
		processedData.push(words[0]);
	});
	return processedData;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const processedData = processData(data);
	console.log(processedData);
};

main();
