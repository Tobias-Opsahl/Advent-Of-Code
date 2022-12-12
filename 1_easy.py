# Advent of code 2022 december the 1st, 1st exercise

from IPython import embed

# input_file = "inputs/1_input_small.txt"
input_file = "inputs/1_input.txt"

current_max = 0  # Max number of calories we have found so far
current_max_index = 0  # The index of the current max elf, starting one 1
current_elf = 0  # The calories to the elf we are calculating right now
index = 1  # The index we are working with right now

with open(input_file) as infile:
    lines = infile.readlines()

for line in lines:
    if line != "\n":  # New item for same elf
        current_elf += int(line.strip())
    else:  # We have collected all items for that elf
        if current_elf > current_max:
            current_max = current_elf
            current_max_index = index

        index += 1  # Bump to next elf
        current_elf = 0  # Reset calorie counter

print(current_max)
