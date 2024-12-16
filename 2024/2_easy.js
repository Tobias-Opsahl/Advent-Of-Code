import fs from "fs/promises";

const inputFilePath = "inputs/2_input.txt";

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
		processedData.push(words);
	});
	return processedData;
};

const checkIfReportIsIncreasing = (report) => {
	for (let i = 0; i < report.length - 1; i++) {
		let diff = report[i + 1] - report[i];
		if (diff > 3 || diff < 1) {
			return false;
		}
	}
	return true;
};

const checkIfReportIsDecreasing = (report) => {
	for (let i = 0; i < report.length - 1; i++) {
		let diff = report[i] - report[i + 1];
		if (diff > 3 || diff < 1) {
			return false;
		}
	}
	return true;
};

const checkIfReportIsSafe = (report) => {
	return checkIfReportIsIncreasing(report) || checkIfReportIsDecreasing(report);
};

const countSafeReports = (reports) => {
	return reports.reduce((counts, report) => {
		if (checkIfReportIsSafe(report)) {
			return counts + 1;
		} else {
			return counts;
		}
	}, 0);
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const processedData = processData(data);
	const safeReports = countSafeReports(processedData);
	console.log(safeReports);
};

main();
