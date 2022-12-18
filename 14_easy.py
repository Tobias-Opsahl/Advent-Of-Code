# Advent of code 2022 december the 14th, 1st exercise

import numpy as np  # Put grid in numpy array

input_file = "inputs/14_input_small.txt"
input_file = "inputs/14_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

# First determine the size of the grid, positive direction is down and right
min_x = 10 ** 10
max_x = 500  # This has to be 500 or more since sand is dropped from here
min_y = 0  # This is hardcoded is sand is dropped from here
max_y = 0
for line in lines:
    words = line.split()
    for i in range(0, len(words), 2):  # Every other word is a coordinate
        coords = words[i].split(",")
        x = int(coords[0])
        y = int(coords[1])
        if x > max_x:
            max_x = x
        if x < min_x:
            min_x = x
        if y > max_y:
            max_y = y
        if y < min_y:
            min_y = y

n_cols = max_x - min_x
n_rows = max_y - min_y
# Grid: 0 marks air (nothing), 1 marks rocks, 2 marks sand. Positive direction is down and right
grid = np.zeros((n_rows + 1, n_cols + 1), dtype=int)


def reindex(index, min_x=min_x):
    """
    Re-indexes the x-axis so that we get indexes starting at 0 instead of min_x.
    We only need to do this for the x-direction, since y always starts on 0.
    """
    return index - min_x


# Now read the input again and mark the stones
for line in lines:
    words = line.split()
    for i in range(0, len(words), 2):  # Every other word is a coordinate
        coords = words[i].split(",")
        if i == 0:  # First input of line
            prev_x = int(coords[0])
            prev_y = int(coords[1])
        else:  # Not first input of line, read and mark stones
            x = int(coords[0])
            y = int(coords[1])
            # print(x, y)
            if x == prev_x:  # Line is on the y-axis
                start = min(y, prev_y)
                end = max(y, prev_y)
                for j in range(start, end + 1):  # Include both end-points
                    grid[j, reindex(x)] = 1  # Mark rock
            elif y == prev_y:  # Line is on the x-axis
                start = min(x, prev_x)
                end = max(x, prev_x)
                for j in range(start, end + 1):  # Include both end-points
                    grid[y, reindex(j)] = 1  # Mark rock
            else:
                raise Exception(f"This should not happen lol")
            # Rocks are marked, not make prepare next coordinate
            prev_x = x
            prev_y = y


def add_sand(grid, sand_x, sand_y):
    """
    Add one drop of sand, recursivly. Returns "new_grid, True" if the sand can be added, and
    "grid, False" if it can not be added.
    First checks if the next candidate (down, down-left, down-right) is
    out of bounds, then calls it recursivly.
    The if-tests could probably be organized more ellegantly.
    """
    if sand_y + 1 >= grid.shape[0]:  # We are off the grid downwards, terminate
        return grid, False
    if grid[sand_y + 1, reindex(sand_x)] == 0:  # Sands falls further straight down
        return add_sand(grid, sand_x, sand_y + 1)

    if reindex(sand_x) - 1 < 0:  # We are off the grid leftwards, terminate
        return grid, False
    elif grid[sand_y + 1, reindex(sand_x) - 1] == 0:  # Sands fall down to the left
        return add_sand(grid, sand_x - 1, sand_y + 1)

    if reindex(sand_x) + 1 >= grid.shape[1]:  # We are off the grid rightwards, terminate
        return grid, False
    elif grid[sand_y + 1, reindex(sand_x) + 1] == 0:  # Sands fall down to the right
        return add_sand(grid, sand_x + 1, sand_y + 1)

    if grid[sand_y, reindex(sand_x)] == 0:  # Tries to place it where we are
        grid[sand_y, reindex(sand_x)] = 2
        return grid, True
    else:  # This should only happen if we get sand at staring place
        return grid, False


counter = 0
condition = True
while(condition):
    grid, condition = add_sand(grid, 500, 0)
    if condition:  # Still True, sand added
        counter += 1

print(counter)
