# Advent of code 2022 december the 11th, 1st exercise

from IPython import embed

input_file = "inputs/11_input_small.txt"
input_file = "inputs/11_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()


# Make class for storing all monkey attributes
class Monkey:
    def __init__(self, starting_items, operations, test, if_true, if_false, index):
        """
        Initialize the parameters.
        """
        self.items = starting_items
        self.arg1 = operations[0]
        self.arg2 = operations[2]
        self.op = operations[1]
        self.test = test
        self.if_true = if_true
        self.if_false = if_false
        self.index = index
        self.inspected = 0

    def set_monkey_list(self, monkey_list):
        """
        Set the list of other monkeys, so they can be accessed when throwing.
        """
        self.monkey_list = monkey_list

    def advance(self):
        """
        Advance one step for the monkey
        """
        for item in self.items:  # Inspect and throw all items, one at a time
            self.inspected += 1
            item = self.operate(item)  # Increase worry-level
            item = int(item / 3)  # Decrease worry level
            cond = self.perform_test(item)  # Test for where to throw
            if cond:  # Throw
                self.monkey_list[self.if_true].throw_to_monkey(item)
            else:  # Throw
                self.monkey_list[self.if_false].throw_to_monkey(item)
        self.items = []  # All items are thrown away

    def throw_to_monkey(self, item):
        """
        Item was thrown to this monkey, add to item list.
        """
        self.items.append(item)  # Add item thrown by some monkey

    def operate(self, x):
        """
        Generic function for doing the worry level increase.
        It is hardcoded that this is two arguments that are either plussed or multiplied,
        and the arguments are either "old" (x) or an int.
        """
        if self.arg1 == "old":
            arg1 = x
        else:
            arg1 = int(self.arg1)
        if self.arg2 == "old":
            arg2 = x
        else:
            arg2 = int(self.arg2)
        if self.op == "+":
            return arg1 + arg2
        elif self.op == "*":
            return arg1 * arg2

    def perform_test(self, x):
        """
        Do the test wich determines where the item is thrown.
        """
        return x % self.test == 0


monkey_list = []  # list of all monkeys
rounds = 20
# This is not elegant, but linter complains. Not sure of the better solution on the top of my head
starting_items, operations, test, if_true, if_false, index = None, None, None, None, None, None

# Would be much faster to hardcode this but whatever.
# Generically loop over the monkeys and add the arguments to the Monkey-Class
for line in lines:
    words = line.split()
    if line == "\n":  # Done with monkey
        monkey = Monkey(starting_items, operations, test, if_true, if_false, index)
        monkey_list.append(monkey)
    elif words[0] == "Monkey":  # New monkey
        index = int(words[1].strip(":"))
    elif words[0] == "Starting":
        starting_items = [int(item.strip(",")) for item in words[2:]]
    elif words[0] == "Operation:":
        # Hardcode three arguments, with the one inbetween being + or *
        arg1 = words[3]
        op = words[4]
        arg2 = words[5]
        operations = [arg1, op, arg2]
    elif words[0] == "Test:":
        test = int(words[-1])  # Hardcode divisibility check by int
    elif words[1] == "true:":
        if_true = int(words[-1])
    elif words[1] == "false:":
        if_false = int(words[-1])

# Add last monkey (last line is _not_ "\n"):
monkey = Monkey(starting_items, operations, test, if_true, if_false, index)
monkey_list.append(monkey)

for monkey in monkey_list:  # Make monkeys acces each other when throwing items
    monkey.set_monkey_list(monkey_list)

# for monkey in monkey_list:  # Gives intermediate output
#     print(monkey.items)
for i in range(rounds):  # Advance all of the rounds
    # print(f"round {i + 1}")
    for monkey in monkey_list:
        monkey.advance()
    # for monkey in monkey_list:  # Gives intermediate output
    #     print(monkey.items)


# Loop over monkey.inspected to find the two biggest
biggest = 0
second_biggest = 0
for monkey in monkey_list:
    if monkey.inspected > biggest:
        second_biggest = biggest
        biggest = monkey.inspected
    elif monkey.inspected > second_biggest:
        second_biggest = monkey.inspected

print(biggest * second_biggest)
