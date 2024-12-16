import fs from "fs/promises";

const inputFilePath = "inputs/14_input.txt";

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
	const positions = [];
	const velocities = [];
	for (let line of lines) {
		line = line.trim();
		const words = line.split(" ");
		const coordinates = words[0].split(",");
		const x = Number(coordinates[0].slice(2, coordinates[0].length));
		const y = Number(coordinates[1]);
		const v = words[1].split(",");
		const vX = Number(v[0].slice(2, v[0].length));
		const vY = Number(v[1]);
		positions.push([y, x]);
		velocities.push([vY, vX]);
	}
	return [positions, velocities];
};

const makeMap = (positions, height, width) => {
	const map = [];
	for (let i = 0; i < height; i++) {
		map.push(new Array(width).fill(0));
	}
	for (const [y, x] of positions) {
		map[y][x] += 1;
	}
	return map;
};

const checkForLine = (map, lineLength) => {
	for (let i = 0; i < map.length - lineLength; i++) {
		for (let j = 0; j < map[0].length; j++) {
			let condition = true;
			for (let k = 0; k < lineLength; k++) {
				if (map[i + k][j] === 0) {
					condition = false;
				}
			}
			if (condition) {
				console.log(i, j);
				return true;
			}
		}
	}
	return false;
};

const printMap = (map, i) => {
	console.log(i);
	map.forEach((row) => {
		let line = row.join("");
		line = line.replace(/0/g, ".");
		console.log(line);
	});
	console.log();
};

const modulo = (n, m) => {
	return ((n % m) + m) % m;
};

const walkSingleStep = (positions, velocities, height, width) => {
	const newPositions = [];
	for (let i = 0; i < positions.length; i++) {
		const [y, x] = positions[i];
		const [vY, vX] = velocities[i];
		const newY = modulo(y + vY, height);
		const newX = modulo(x + vX, width);
		newPositions.push([newY, newX]);
	}
	return newPositions;
};

const walk = (positions, velocities, height, width, steps) => {
	for (let i = 0; i < steps; i++) {
		positions = walkSingleStep(positions, velocities, height, width);
		const map = makeMap(positions, height, width);
		if (checkForLine(map, 10)) {
			printMap(map, i);
		}
	}
	return positions;
};

const calculateScore = (positions, height, width) => {
	let upperLeft = 0;
	let upperRight = 0;
	let lowerLeft = 0;
	let lowerRight = 0;
	const middleY = (height - 1) / 2;
	const middleX = (width - 1) / 2;
	for (const [y, x] of positions) {
		if (y === middleY || x === middleX) {
			continue;
		}
		if (y < middleY) {
			if (x < middleX) {
				upperLeft++;
			} else {
				upperRight++;
			}
		} else {
			if (x < middleX) {
				lowerLeft++;
			} else {
				lowerRight++;
			}
		}
	}
	return [upperLeft, upperRight, lowerLeft, lowerRight];
};

const main = async () => {
	const height = 103;
	const width = 101;
	const steps = 11000;
	const data = await readInput(inputFilePath);
	const [positions, velocities] = processData(data);
	const walkedPositions = walk(positions, velocities, height, width, steps);
	calculateScore(walkedPositions, height, width);
};

main();
