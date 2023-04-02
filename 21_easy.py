# Advent of code 2022 december the 21st, 1st exercise

from IPython import embed

input_file = "inputs/21_input_small.txt"
input_file = "inputs/21_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

monkeys = {}
pending_monkeys = {}
for line in lines:
    to_be_popped = []
    for pending in pending_monkeys:
        first = pending_monkeys[pending][0]
        second = pending_monkeys[pending][1]
        if first in monkeys and second in monkeys:
            operation = pending_monkeys[pending][2]
            if operation == "+":
                monkeys[pending] = monkeys[first] + monkeys[second]
            if operation == "-":
                monkeys[pending] = monkeys[first] - monkeys[second]
            if operation == "*":
                monkeys[pending] = monkeys[first] * monkeys[second]
            if operation == "/":
                monkeys[pending] = monkeys[first] / monkeys[second]
            to_be_popped.append(pending)
    for to_pop in to_be_popped:  # Remove newly added monkeys from pending
        pending_monkeys.pop(to_pop)

    words = line.split()
    monkey_name = words[0].strip(":")
    if len(words) == 2:  # Monkey is only screaming an int
        monkey_value = int(words[1])
        monkeys[monkey_name] = monkey_value
    else:
        operation = words[2]
        first = words[1]
        second = words[3]
        pending_monkeys[monkey_name] = [first, second, operation]

# Mega not super-good quick fix for updating all of the pending-monkeys
for _ in range(10000):
    to_be_popped = []
    for pending in pending_monkeys:
        first = pending_monkeys[pending][0]
        second = pending_monkeys[pending][1]
        if first in monkeys and second in monkeys:
            operation = pending_monkeys[pending][2]
            if operation == "+":
                monkeys[pending] = monkeys[first] + monkeys[second]
            if operation == "-":
                monkeys[pending] = monkeys[first] - monkeys[second]
            if operation == "*":
                monkeys[pending] = monkeys[first] * monkeys[second]
            if operation == "/":
                monkeys[pending] = monkeys[first] / monkeys[second]
            to_be_popped.append(pending)
    for to_pop in to_be_popped:  # Remove newly added monkeys from pending
        pending_monkeys.pop(to_pop)
# embed()
print(int(monkeys["root"]))
