# Advent of code 2022 december the 3rd, 1st exercise

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


total_sum = 0
for line in lines:
    shared_item = None
    mid = int(len(line) / 2)  # Split the items in first and last compartment
    first_half = line[:mid]
    last_half = line[mid:]

    for char in first_half:  # Look through all of the characters in the first half and ...
        if char in last_half:  # Check if they are in the second
            shared_item = char  # Found the shared character, save and break
            break

    priority = get_priority(shared_item)  # Get the correct priority
    total_sum += priority


print(total_sum)
