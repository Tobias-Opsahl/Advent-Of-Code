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
		const orderArray = ruleMap.get(value);
		if (!orderArray) {
			continue;
		}
		for (let j = 0; j < i; j++) {
			if (orderArray.includes(order[j])) {
				return 0;
			}
		}
	}
	return middleElement;
};

const checkAllOrders = (orders, ruleMap) => {
	return orders.reduce((sum, order) => {
		return sum + checkOrder(order, ruleMap);
	}, 0);
};

const main = async () => {
	const data = await readInput(inputFilePath);
	const [rules, orders] = processData(data);
	const ruleMap = makeRuleMap(rules);
	const results = checkAllOrders(orders, ruleMap);
	console.log(results);
};

main();
