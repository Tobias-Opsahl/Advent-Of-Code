import fs from "fs/promises";

const inputFilePath = "inputs/5_input.txt";

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
	const rules = [];
	const orders = [];
	let order = false;
	for (const line of lines) {
		if (line.trim() === "") {
			order = true;
			continue;
		}
		if (order) {
			const words = line.split(",").map(Number);
			orders.push(words);
		} else {
			const words = line.split("|").map(Number);
			rules.push(words);
		}
	}
	return [rules, orders];
};

const makeRuleMap = (rules) => {
	const ruleMap = new Map();
	rules.forEach(([key, value]) => {
		if (!ruleMap.has(key)) {
			ruleMap.set(key, []);
		}
		ruleMap.get(key).push(value);
	});
	return ruleMap;
};

const checkOrder = (order, ruleMap) => {
	const middleElement = order[(order.length - 1) / 2];
	for (let i = 0; i < order.length; i++) {
		const value = order[i];
		const ruleArray = ruleMap.get(value);
		if (!ruleArray) {
			continue;
		}
		for (let j = 0; j < i; j++) {
			if (ruleArray.includes(order[j])) {
				return 0;
			}
		}
	}
	return middleElement;
};

const getCorrectOrder = (order, ruleMap) => {
	while (checkOrder(order, ruleMap) === 0) {
		// Horrible solution. Bubble up algorithm did not work in one sweep,
		// so I just iterated the whole procedure until it worked.
		for (let i = order.length - 1; i > 0; i--) {
			const value = order[i];
			const ruleArray = ruleMap.get(value);
			if (!ruleArray) {
				continue;
			}
			let j = i - 1;
			while (j >= 0) {
				const otherValue = order[j];
				if (ruleArray.includes(otherValue)) {
					const [element] = order.splice(i, 1);
					order.splice(j, 0, element);
				} else {
					j--;
				}
			}
		}
	}
	return order;
};

const getIncorrectOrders = (orders, ruleMap) => {
	const incorrectOrders = [];
	for (const order of orders) {
		if (checkOrder(order, ruleMap) === 0) {
			incorrectOrders.push(order);
		}
	}
	return incorrectOrders;
};

const calculateIncorrectOrders = (orders, ruleMap) => {
	let sum = 0;
	orders.forEach((order) => {
		const correctOrder = getCorrectOrder(order, ruleMap);
		console.log(checkOrder(correctOrder, ruleMap));
		sum += correctOrder[(correctOrder.length - 1) / 2];
	});
	return sum;
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const [rules, orders] = processData(data);
	const ruleMap = makeRuleMap(rules);
	const incorrectOrders = getIncorrectOrders(orders, ruleMap);
	const results = calculateIncorrectOrders(incorrectOrders, ruleMap);
	console.log(results);
};

main();
