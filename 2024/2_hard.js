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

const checkDiff = (diff, increasing = true) => {
	if (!increasing) {
		diff = -diff;
	}
	if (diff > 3 || diff < 1) {
		return false;
	}
	return true;
};

const checkReportIndexes = (report, increasing) => {
	for (let i = 0; i < report.length - 1; i++) {
		let diff = report[i + 1] - report[i];
		if (!checkDiff(diff, increasing)) {
			return i;
		}
	}
	return report.length;
};

const checkReport = (report, increasing) => {
	const index = checkReportIndexes(report, increasing);
	if (index === report.length) {
		return true;
	}
	const newReport1 = [...report];
	const newReport2 = [...report];
	newReport1.splice(index, 1);
	if (index < report.length - 1) {
		newReport2.splice(index + 1, 1);
	}
	if (
		checkReportIndexes(newReport1, increasing) === newReport1.length ||
		checkReportIndexes(newReport2, increasing) === newReport2.length
	) {
		return true;
	}
	return false;
};

const checkIfReportIsIncreasing = (report) => {
	return checkReport(report, true);
};

const checkIfReportIsDecreasing = (report) => {
	return checkReport(report, false);
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
