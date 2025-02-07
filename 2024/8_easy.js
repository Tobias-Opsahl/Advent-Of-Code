import fs from "fs/promises";

const inputFilePath = "inputs/8_input.txt";

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
		const words = line.split("");
		processedData.push(words);
	});
	return processedData;
};

const getAntennas = (map) => {
	const antennas = new Map();
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			let value = map[i][j];
			if (value === ".") {
				continue;
			}
			if (!antennas.has(value)) {
				antennas.set(value, []);
			}
			antennas.get(value).push([i, j]);
		}
	}
	return antennas;
};

const isAntinodeInMap = (antinode, mapHeight, mapWidth) => {
	if (antinode[0] < 0 || antinode[0] >= mapHeight) {
		return false;
	}
	if (antinode[1] < 0 || antinode[1] >= mapWidth) {
		return false;
	}
	return true;
};

const calculateAntinodesFromAntennaPair = (antenna1, antenna2) => {
	let antinodes = [];
	const antinode1x = antenna1[0] - (antenna2[0] - antenna1[0]);
	const antinode1y = antenna1[1] - (antenna2[1] - antenna1[1]);
	const antinode2x = antenna2[0] + (antenna2[0] - antenna1[0]);
	const antinode2y = antenna2[1] + (antenna2[1] - antenna1[1]);
	antinodes.push([antinode1x, antinode1y]);
	antinodes.push([antinode2x, antinode2y]);
	return antinodes;
};

const hasCoordinate = (antinodes, coordinate) => {
	for (const antinode of antinodes) {
		if (antinode[0] === coordinate[0] && antinode[1] === coordinate[1]) {
			return true;
		}
	}
	return false;
};

const calculateAntinodes = (coordinates, antinodes, mapHeight, mapWidth) => {
	if (coordinates.length === 1) {
		return antinodes;
	}
	for (let i = 0; i < coordinates.length; i++) {
		for (let j = i + 1; j < coordinates.length; j++) {
			const newAntinodes = calculateAntinodesFromAntennaPair(coordinates[i], coordinates[j]);
			for (const antinode of newAntinodes) {
				if (isAntinodeInMap(antinode, mapHeight, mapWidth) && !hasCoordinate(antinodes, antinode)) {
					antinodes.push(antinode);
				}
			}
		}
	}
	return antinodes;
};

const calculateAllAntinodes = (antennas, mapHeight, mapWidth) => {
	let antinodes = [];
	for (const coordinates of antennas.values()) {
		antinodes = calculateAntinodes(coordinates, antinodes, mapHeight, mapWidth);
	}
	return antinodes;
};

const printMap = (map) => {
	map.forEach((row) => {
		const line = row.join("");
		console.log(line);
	});
	console.log();
};

const printMapWithAntinodes = (map, antinodes) => {
	for (let antinode of antinodes) {
		if (map[antinode[0]][antinode[1]] === ".") {
			map[antinode[0]][antinode[1]] = "#";
		} else if (map[antinode[0]][antinode[1]] === "#") {
			console.log("Double antinode", antinode);
			map[antinode[0]][antinode[1]] = "+";
		} else {
			map[antinode[0]][antinode[1]] = "!";
		}
	}
	printMap(map);
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const map = processData(data);
	const antennas = getAntennas(map);
	const antinodes = calculateAllAntinodes(antennas, map.length, map[0].length);
	const results = antinodes.length;
	printMap(map);
	printMapWithAntinodes(map, antinodes);
	console.log(results);
};

main();
