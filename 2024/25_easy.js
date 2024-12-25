import fs from "fs/promises";

const inputFilePath = "inputs/25_input.txt";

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
	const locks = [];
	const keys = [];
	let firstLine = true;
	let isLock;
	let object = [];
	lines.forEach((line) => {
		line = line.trim();
		if (line === "") {
			if (isLock) {
				locks.push(object);
			} else {
				keys.push(object);
			}
			object = [];
			firstLine = true;
		} else {
			const row = line.split("");
			if (firstLine) {
				if (row[0] === "#") {
					isLock = true;
				} else {
					isLock = false;
				}
			}
			object.push(row);
			firstLine = false;
		}
	});
	if (isLock) {
		locks.push(object);
	} else {
		keys.push(object);
	}
	return [locks, keys];
};

const transpose = (matrix) => {
	return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}

const getNumberRepresentation = (object) => {
	const transposed = transpose(object);
	const numberRepresentation = [];
	for (let i = 0; i < transposed.length; i++) {
		let number = -1;
		const row = transposed[i];
		for (let j = 0; j < row.length; j++) {
			if (row[j] === "#") {
				number++;
			}
		}
		numberRepresentation.push(number);
	}
	return numberRepresentation;
}

const isCompatible = (lock, key) => {
	for (let i = 0; i < lock.length; i++) {
		if (lock[i] + key[i] > 5) {
			return 0;
		}
	}
	return 1;
}

const calculateCompatibleness = (locks, keys) => {
	locks = locks.map((lock) => getNumberRepresentation(lock));
	keys = keys.map((key) => getNumberRepresentation(key));

	let sum = 0;
	for (let i = 0; i < locks.length; i++) {
		const lock = locks[i];
		for (let j = 0; j < keys.length; j++) {
			const key = keys[j];
			sum += isCompatible(lock, key);
		}
	}
	return sum;
}

const main = async () => {
	"// eslint-disable-next-line no-unused-vars";
	const data = await readInput(inputFilePath);
	const [locks, keys] = processData(data);
	const results = calculateCompatibleness(locks, keys);
	console.log(results);
	// 24151 too high
};

main();
