import fs from "fs/promises";

const inputFilePath = "inputs/19_input.txt";

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
	let patternInput = false;
	let towels = [];
	let patterns = [];
	for (let line of lines) {
		line = line.trim();
		if (line === "") {
			patternInput = true;
			continue;
		}
		if (patternInput) {
			patterns.push(line);
		} else {
			const words = line.split(",");
			words.forEach((word) => {
				towels.push(word.trim())
			})
		}
	}
	return [towels, patterns];
};

const isMatching = (towel, subPattern) => {
	if (towel.length > subPattern.length) {
		return false;
	}
	for (let i = 0; i < towel.length; i++) {
		if (towel[i] === subPattern[i]) {
			continue;
		} else {
			return false;
		}
	}
	return true;
}

const checkSinglePattern = (towels, pattern) => {
	if (pattern === "") {
		return 1;
	}

	for (const towel of towels) {
		if (isMatching(towel, pattern)) {
			const subPattern = pattern.slice(towel.length);
			if (checkSinglePattern(towels, subPattern)) {
				return 1;
			}
		}
	}
	return 0;
}

const countValidPatterns = (towels, patterns) => {
	let count = 0;
	patterns.forEach((pattern) => {
		count += checkSinglePattern(towels, pattern);
	})
	return count;
}

const main = async () => {
	const data = await readInput(inputFilePath);
	const [towels, patterns] = processData(data);
	const results = countValidPatterns(towels, patterns);
	console.log(results);
	"// eslint-disable-next-line no-unused-vars";
};

main();
