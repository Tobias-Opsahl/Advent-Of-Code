# Advent of code 2022 december the 5th, 2nd exercise

from IPython import embed

input_file = "inputs/5_input_small.txt"
input_file = "inputs/5_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

# First read the crate-initializations. This is done genericly, so there is more code.
# Please look at the input (text file) and comments to understand the format better.

ground_line_index = None  # The line where the indexes of the box-places are
counter = 0

# Find the index-line
for line in lines:
    if line == "\n":  # If we read just a newline, we are done with the crate initializations
        ground_line_index = counter - 1  # The index-line is the one before the empty line
        break
    else:
        counter += 1

indices = lines[ground_line_index].split()
n_indices = len(indices)  # Find the amount of indices, crate-positions

positions = [[] for _ in range(n_indices)]  # Create nested list for crate-positions
# first element is ground level, last element is top for stack

# Now read the boxes
for k in range(ground_line_index):  # Read the lines before the index-line
    line = lines[k]
    for i in range(n_indices):  # Check if there is a box at each position
        # There are 4 spaces between each position, and it starts at 1
        if line[1 + 4 * i] != " ":  # We found a new box
            # Insert at the beginning since we start reading from the top
            positions[i].insert(0, line[1 + 4 * i])


# Then read the moving instructions and move the crates
for k in range(ground_line_index + 2, len(lines)):  # Loop over the rest of the lines
    line = lines[k]
    words = line.split()
    n_crates = int(words[1])  # Amount of crates to move
    from_index = int(words[3])  # Place to move the crates from
    to_index = int(words[5])  # Place to move the crates to
    n_from = len(positions[from_index - 1])  # Amount of crates in the from position

    for i in range(n_crates):
        # We now start by popping the crate we want to add first, and iterate to the top
        pop_index = n_from - n_crates  # This is the bottom of the stack we want to move
        positions[to_index - 1].append(positions[from_index - 1].pop(n_from - n_crates))

# Now positions is the moved creates. We just need to collect the top-crates
sequence_list = [positions[i].pop() for i in range(n_indices)]  # Assume no empty list (from task)
sequence = "".join(sequence_list)

print(sequence)
