# Advent of code 2022 december the 1st, 2nd exercise

from IPython import embed

# input_file = "inputs/1_input_small.txt"
input_file = "inputs/1_input.txt"
top_n = 3  # The n top amount of elves we care about (which is hardcoded to 3)
top_list = [0] * top_n  # The calories of the top n elves
current_elf = 0  # The calories to the elf we are calculating right now

with open(input_file) as infile:
    lines = infile.readlines()

lines.append("\n")  # Add line break at the end

for line in lines:
    if line != "\n":  # New item for same elf
        current_elf += int(line.strip())
    else:  # We have collected all items for that elf
        for i in range(top_n):  # Compare to the top elves
            if current_elf > top_list[i]:
                top_list.insert(i, current_elf)  # Put the new value into the right place and ...
                top_list.pop()  # Remove the lowest value. Every value jumps one step back
                break  # Break if we enter the top three, so that we do not duplicate

        current_elf = 0  # Reset calorie counter

print(sum(top_list))
