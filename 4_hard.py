# Advent of code 2022 december the 4th, 2nd exercise

from IPython import embed

# input_file = "inputs/4_input_small.txt"
input_file = "inputs/4_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

total_overlap = 0

for line in lines:
    first, second = line.split(",")  # First split the sections for the two elves, first and second
    first1 = int(first.split("-")[0])  # Then find the start end end for each elf
    first2 = int(first.split("-")[1])
    second1 = int(second.split("-")[0])
    second2 = int(second.split("-")[1])

    # Find some overlap
    if not((first2 < second1) or (second2 < first1)):
        total_overlap += 1
    # This is the same as (first2 >= second1) and (second2 >= first1)

print(total_overlap)
