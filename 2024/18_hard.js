import fs from "fs/promises";

const inputFilePath = "inputs/18_input.txt";

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
		const words = line.split(",").map(Number);
		processedData.push([words[1], words[0]]);
	});
	return processedData;
};

const search = (map, height, width, bfs = true) => {
	let count = 0;
	const start = [0, 0];
	const end = [height - 1, width - 1];
	const visited = Array.from({ length: height }, () => Array(width).fill(false));
	visited[start[0]][start[1]] = 0;
	const queue = [[...start, 0]];
	const directions = [
		[0, 1], // Right
		[1, 0], // Down
		[0, -1], // Left
		[-1, 0], // Up
	];

	while (queue.length > 0) {
		count++;
		let y, x, distance;
		if (bfs) {
			[y, x, distance] = queue.shift();
		} else {
			// Depth first search, does not work in this task.
			[y, x, distance] = queue.pop();
		}
		visited[y][x] = distance;
		if (y === end[0] && x === end[1]) {
			return [distance, count];
		}

		for (const [dy, dx] of directions) {
			const nextY = y + dy;
			const nextX = x + dx;

			if (nextY >= height || nextY < 0 || nextX >= width || nextX < 0) {
				continue; // Out-of-bounds
			}

			if (map[nextY][nextX] === "#" || visited[nextY][nextX]) {
				continue; // Wall or visited
			}
			visited[nextY][nextX] = true;
			queue.push([nextY, nextX, distance + 1]);
		}
	}
	return [-1, count];
};

const makeMap = (bytes, nBytes, height, width) => {
	const map = Array.from({ length: height }, () => Array(width).fill("."));
	bytes.slice(0, nBytes).forEach(([y, x]) => {
		map[y][x] = "#";
	});
	return map;
};

const findByte = (bytes, height, width) => {
	let totalCount = 0;
	for (let i = 0; i < bytes.length; i++) {
		const map = makeMap(bytes, i + 1, height, width);
		const [distance, count] = search(map, height, width);
		totalCount += count;
		if (distance === -1) {
			console.log(`Total count brute force: ${totalCount}`);
			return bytes[i];
		}
	}
	return [-1, -1];
}

const findByteBinarySearch = (bytes, height, width) => {
	let totalCount = 0;
	let left = 0;
	let right = bytes.length - 1;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		const map = makeMap(bytes, mid, height, width);
		const [distance, count] = search(map, height, width);
		totalCount += count;
		if (distance === -1) {
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}
	console.log(`Total count binary search: ${totalCount}`);
	if (left < bytes.length) {
		return bytes[left];
	}
	return [-1, -1];
}

// eslint-disable-next-line no-unused-vars
const printMap = (map) => {
	map.forEach((row) => {
		let line = row.join("");
		console.log(line);
	});
	console.log();
};

const main = async () => {
	const height = 71;
	const width = 71;
	const data = await readInput(inputFilePath);
	const bytes = processData(data);
	const byte = findByte(bytes, height, width);
	console.log(byte);
	const byte2 = findByteBinarySearch(bytes, height, width);
	console.log(byte2);
};

main();
