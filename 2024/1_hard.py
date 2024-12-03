import fs from "fs/promises";

const inputFilePath = "inputs/1_input.txt";

const readInput = async (filePath) = > {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return data;
	} catch(err) {
		console.error("Error reading the file:", err);
		throw err;
	}
};

const processData = (data) = > {
	const lines = data.split("\n");
	const leftList = [];
	const rightList = []
	lines.forEach((line)= > {
		const words = line.split(/\s+/).map(Number);
		leftList.push(words[0]);
		rightList.push(words[1]);
	});
	return [leftList, rightList];
};

const calculateDistance = (leftList, rightList) => {
	let sum = 0;
	for (let i = 0; i < leftList.length; i++) {
		sum += Math.abs(leftList[i] - rightList[i])
	}
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const [leftList, rightList] = processData(data);
	leftList.sort();
	rightList.sort();
	const distance = calculateDistance(leftList, rightList);
	console.log(distance);
};

main();
