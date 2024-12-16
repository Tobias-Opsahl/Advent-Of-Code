# Advent of code 2022 december the 13th, 1st exercise
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


total_sum = 0
index_counter = 1
part1 = None
part2 = None
for line in lines:
    if line == "\n":  # We have reached newline, which means part1 and part2 is not None
        condition = check_lists(part1, part2)
        if condition:
            total_sum += index_counter
        index_counter += 1
        part1 = None  # Reset values
        part2 = None
    elif part1 is None:  # part1 and part2 is not yet read, so we are readnig part1
        part1 = make_list(line.strip())
    elif part2 is None:  # part1 is read but not part2, which means we are reading part2
        part2 = make_list(line.strip())

print(total_sum)
