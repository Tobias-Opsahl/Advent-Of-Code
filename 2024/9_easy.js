import fs from "fs/promises";

const inputFilePath = "inputs/9_input.txt";

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
	const processedData = data.split("").map(Number);
	return processedData;
};

const uncompress = (compressedFiles) => {
	const uncompressed = [];
	let file = true;
	let idCounter = 0;
	for (let i = 0; i < compressedFiles.length; i++) {
		const value = compressedFiles[i];
		if (file) {
			for (let j = 0; j < value; j++) {
				uncompressed.push(idCounter);
			}
			idCounter++;
		} else {
			for (let j = 0; j < value; j++) {
				uncompressed.push(".");
			}
		}
		file = !file;
	}
	return uncompressed;
};

const moveFiles = (uncompressed) => {
	const files = [...uncompressed];
	let marker = 0;
	let done = false;
	let lastFile = 0;
	for (let i = uncompressed.length - 1; i >= 0; i--) {
		const value = uncompressed[i];
		if (value === ".") {
			continue;
		}
		while (files[marker] !== ".") {
			marker++;
			if (marker > i) {
				done = true;
			}
		}
		if (done) {
			lastFile = marker;
			break;
		}
		files[marker] = value;
	}
	const finalFiles = files.slice(0, lastFile);
	return finalFiles;
};

const computeChecksum = (files) => {
	let sum = 0;
	for (let i = 0; i < files.length; i++) {
		sum += files[i] * i;
	}
	return sum;
};

// eslint-disable-next-line no-unused-vars
const printFileSystem = (files) => {
	const line = files.join("");
	console.log(line);
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const compressed = processData(data);
	const uncompressed = uncompress(compressed);
	const files = moveFiles(uncompressed);
	const results = computeChecksum(files);
	console.log(results);
};

main();
