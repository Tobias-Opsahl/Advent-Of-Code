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
	let previousValue = uncompressed[uncompressed.length - 1];
	let lastBlockIndex = uncompressed.length - 1;
	for (let i = uncompressed.length - 1; i >= 0; i--) {
		const value = uncompressed[i];
		// if (value === ".") {
		// 	continue;
		// }
		if (value === previousValue) {
			continue;
		} else if (previousValue === ".") {
			// New value other than "."
			previousValue = value;
			lastBlockIndex = i;
			continue;
		}
		// Value is now different than previous value
		const firstBlockIndex = i + 1;
		const blockSize = lastBlockIndex - firstBlockIndex + 1;
		let emptySpaces = 0;
		for (let j = 0; j < uncompressed.length; j++) {
			if (j > i) {
				break;
			}
			if (files[j] === ".") {
				emptySpaces++;
			} else {
				emptySpaces = 0;
			}
			if (emptySpaces === blockSize) {
				// Found a large enough empty block to move our files
				for (let k = 0; k < blockSize; k++) {
					files[j - blockSize + k + 1] = previousValue;
					files[i + k + 1] = ".";
				}
				break;
			}
		}
		previousValue = value;
		lastBlockIndex = i;
	}
	// Does not check the very first block
	return files;
};

const computeChecksum = (files) => {
	let sum = 0;
	for (let i = 0; i < files.length; i++) {
		if (files[i] === ".") {
			continue;
		}
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
	// printFileSystem(uncompressed);
	// printFileSystem(files);
	console.log(results);
};

main();
