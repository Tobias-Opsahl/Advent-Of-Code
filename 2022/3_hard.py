# Advent of code 2022 december the 3rd, 2nd exercise

from IPython import embed

# input_file = "inputs/3_input_small.txt"
input_file = "inputs/3_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()


def get_priority(char):
    """
    Get the priority of a character, given by the task.
    a to z have priority 1 to 26, and A to Z have priority 27 to 52.

    Note: ord(char) returns 97 to 122 for a to z, and 65 to 90 for A to Z.
    """
    if char.isupper():
        priority = ord(char) - 38
    else:
        priority = ord(char) - 96
    return priority


def find_badge(first, second, third):
    """
    Loop over the characters in the first elve to find something that is in all of them
    """
    for char in first:
        if char in second:
            if char in third:  # Find something in all elves backpack
                return char


total_sum = 0

for i in range(int(len(lines) / 3)):
    # Index the three elves in the group
    first = lines[3 * i]
    second = lines[3 * i + 1]
    third = lines[3 * i + 2]
    badge = find_badge(first, second, third)

    priority = get_priority(badge)  # Get the correct priority
    # print(badge, priority)
    total_sum += priority

print(total_sum)
