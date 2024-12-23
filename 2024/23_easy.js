import fs from "fs/promises";

const inputFilePath = "inputs/23_input.txt";

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
		const words = line.split("-");
		processedData.push(words);
	});
	return processedData;
};

const findThreeConnections = (computers) => {
	const threeList = [];
	const added = new Set();
	for (let i = 0; i < computers.length; i++) {
		const firstComputer = computers[i][0];
		const secondComputer = computers[i][1];
		const firstNeighbours = [];
		for (let j = i + 1; j < computers.length; j++) {
			const firstNeighbour = computers[j][0];
			const secondNeighbour = computers[j][1];
			if (firstNeighbour === firstComputer) {
				firstNeighbours.push(secondNeighbour);
			}
			if (secondNeighbour === firstComputer) {
				firstNeighbours.push(firstNeighbour);
			}
		}
		for (let j = 0; j < computers.length; j++) {
			const firstNeighbour = computers[j][0];
			const secondNeighbour = computers[j][1];
			if (firstNeighbour === secondComputer) {
				if (firstNeighbours.includes(secondNeighbour)) {
					const neighbours = [firstComputer, secondComputer, secondNeighbour].sort();
					const neighboursString = neighbours.join("");
					if (!added.has(neighboursString)) {
						threeList.push(neighbours);
						added.add(neighboursString);
					}
				}
			}
			if (secondNeighbour === secondComputer) {
				if (firstNeighbours.includes(firstNeighbour)) {
					const neighbours = [firstComputer, secondComputer, firstNeighbour].sort();
					const neighboursString = neighbours.join("");
					if (!added.has(neighboursString)) {
						threeList.push(neighbours);
						added.add(neighboursString);
					}
				}
			}
		}
	}
	return threeList.sort();
}

const countTs = (threeList) => {
	let sum = 0;
	for (const [c1, c2, c3] of threeList) {
		if (c1[0] === "t" || c2[0] === "t" || c3[0] === "t") {
			sum += 1;
		}
	}
	return sum;
}

const main = async () => {
	"// eslint-disable-next-line no-unused-vars";
	const data = await readInput(inputFilePath);
	const computers = processData(data);
	const threeList = findThreeConnections(computers);
	const results = countTs(threeList);
	console.log(results);
};

main();
