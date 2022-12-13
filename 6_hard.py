# Advent of code 2022 december the 6th, 2nd exercise

from IPython import embed

# input_file = "inputs/6_input_small.txt"
input_file = "inputs/6_input.txt"

with open(input_file) as infile:
    line = infile.read()

n_diff = 14  # The amount of different characters we need

current = []  # The list with the current four elements we are reading

for i in range(n_diff):  # Add the first four letters to the list
    current.append(line[i])


def check_different(my_list):
    """
    Checks if "my_list" contains only different elements.
    Returns "True" if only different, else "False".
    """
    for i in range(len(my_list) - 1):
        for j in range(i + 1, len(my_list)):
            if my_list[i] == my_list[j]:
                return False

    return True


for i in range(4, len(line)):
    if check_different(current):  # Check if we have four different symbols
        break

    for j in range(n_diff - 1):  # If not, move all element in the list one to the left
        current[j] = current[j + 1]
    current[n_diff - 1] = line[i]

print(i)

embed()
