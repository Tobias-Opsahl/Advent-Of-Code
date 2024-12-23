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
		processedData.push(words.sort());
	});
	return processedData;
};

const overlap = (list1, list2, degree) => {
	let sum = 0;
	list1.forEach((item) => {
		if (list2.includes(item)) {
			sum += 1;
		}
	});
	if (sum === degree) {
		return true;
	}
	return false;
}

const getCompleteGraph = (connected, degree) => {
	const completeList = [];
	const added = new Set();
	for (let i = 0; i < connected.length; i++) {
		const graph1 = connected[i];
		for (let j = i + 1; j < connected.length; j++) {
			const graph2 = connected[j];
			if (overlap(graph1, graph2, degree - 1)) {
				const newNodes = [];
				graph1.forEach((node) => {
					if (!graph2.includes(node)) {
						newNodes.push(node);
					}
				});
				graph2.forEach((node) => {
					if (!graph1.includes(node)) {
						newNodes.push(node);
					}
				});
				// Check that these two new nodes are connected
				let newConnected = false;
				for (let k = 0; k < connected.length; k++) {
					if (connected[k].includes(newNodes[0]) && connected[k].includes(newNodes[1])) {
						newConnected = true;
					}
				}
				if (!newConnected) {
					continue;
				}
				// Add lists together and remove duplicates
				const complete = [...new Set([... graph1, ...graph2])].sort();
				const completeString = complete.join("");
				if (!added.has(completeString)) {
					completeList.push(complete);
					added.add(completeString);
				}
			}
		}
	}
	return completeList.sort();
}

const findBiggestConnected = (computers) => {
	let connected = computers;
	let degree = 2;
	while (connected.length > 1) {
		console.log(degree, connected.length);
		connected = getCompleteGraph(connected, degree);
		degree++;
	}
	console.log(connected, degree);
	return connected[0].sort().join(",");
}

const main = async () => {
	"// eslint-disable-next-line no-unused-vars";
	const data = await readInput(inputFilePath);
	const computers = processData(data);
	const results = findBiggestConnected(computers);
	console.log(results);
};

main();
