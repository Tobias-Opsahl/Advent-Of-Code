# Advent of code 2022 december the 13th, 2nd exercise
# NOTE: This task can be solved considerably "better", by both making the
# recursive function better, but also by doing the parsing without eval.

import ast

input_file = "inputs/13_input_small.txt"
input_file = "inputs/13_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()
lines.append("\n")  # Makes reading a bit easier


def check_lists(part1, part2):
    """
    Checks lists according to the task and returns True / False if Right / Wrong order, resepctivly.
    part1 is left and part2 is right.
    Does it recursivly.
    None is returned if the order can not be determined, which should never be the case for the
    main lists, but can be for sub-list recursive input.

    This is done pretty unelegant, the test for list-length should not have to be
    repeated. However, it works lol.
    """
    if isinstance(part1, int) and isinstance(part2, int):
        if part1 < part2:  # Right order
            return True
        elif part1 > part2:  # Wrong order
            return False
        elif part1 == part2:  # Undetermined, check nest part of the list
            # return check_lists(part1[1:], part2[1:])
            return None  # Undetermined
    if isinstance(part1, list) and isinstance(part2, list):
        if (len(part1) == 0) and (len(part2) == 0):
            return None  # Undetermined
        elif len(part1) == 0:  # Left list ran out of items, Right order
            return True
        elif len(part2) == 0:  # Right list ran out of items, Wrong order
            return False
        else:  # Two non-zero lists, check all ilements
            cond = None
            counter = 0
            while (cond is None):  # Loop until one element determines order
                if len(part1) <= counter and len(part2) <= counter:
                    break  # Undetermined
                elif len(part1) <= counter:
                    cond = True
                elif len(part2) <= counter:
                    cond = False
                else:
                    cond = check_lists(part1[counter], part2[counter])
                    counter += 1
            return cond
    elif isinstance(part1, int) and isinstance(part2, list):
        return check_lists([part1], part2)
    elif isinstance(part1, list) and isinstance(part2, int):
        return check_lists(part1, [part2])
    else:
        raise Exception("This else-block should not happen lol")


def make_list(line):
    """
    Convert string to list format.
    This is done with eval, which is almost cheating, but whatever.
    """
    # return eval(line)  # Changing this line after reading the stupid rm rf jokes on reddit
    return ast.literal_eval(line)


# Do insertion sort, add each element while we read it. Add the divisors last.
order_list = []  # The ordered list of elements
for line in lines:
    if line == "\n":
        continue
    else:
        new_element = make_list(line.strip())
        for i in range(len(order_list) + 1):  # Loop until we have correct order
            if i == len(order_list):
                order_list.append(new_element)  # new_element is "bigger" (wrong) for every item, insert last.
            if check_lists(new_element, order_list[i]):  # Correct order
                order_list.insert(i, new_element)  # new_element is "smaller" then order_list[i]
                break

# Now we have the ordered list, lets insert the dividors
dividors = [[[2]], [[6]]]
total_prod = 1
for dividor in dividors:
    # Should probably be put in a function instead of repeating but whatever
    for i in range(len(order_list) + 1):  # Loop until we have correct order
        if i == len(order_list):
            order_list.append(dividor)  # dividor is "bigger" (wrong) for every item, insert last.
        if check_lists(dividor, order_list[i]):  # Correct order
            order_list.insert(i, dividor)  # dividor is "smaller" then order_list[i]
            break
    total_prod *= i + 1  # The index is the one after where we inserted
    print(i)

print(total_prod)
