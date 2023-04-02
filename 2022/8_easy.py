# Advent of code 2022 december the 8th, 1st exercise

input_file = "inputs/8_input_small.txt"
input_file = "inputs/8_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

grid = []  # Grid of the tree-heights, [row][col]
for line in lines:
    grid.append(list(line.strip()))  # Not necessary to turn into a list, can be string

total_visible = 2 * len(grid) + 2 * len(grid[0]) - 4  # Add the edges as visible


def is_visible(grid, i, j):
    """
    Check if tree at indices "i", "j" is visible from any angles in "grid".
    Returns True if it is, False if not.
    """
    n_rows = len(grid)
    n_cols = len(grid[0])
    height = grid[i][j]
    # Check visibility from all of the angles
    # Up
    visible = True
    for k in range(0, i):
        if grid[k][j] >= height:  # Higher tree, not visible from this side
            visible = False
            break
    if visible:  # We looped through everything without breaking, visible
        return True
    # Down
    visible = True
    for k in range(i + 1, n_rows):
        if grid[k][j] >= height:  # Higher tree, not visible from this side
            visible = False
            break
    if visible:  # We looped through everything without breaking, visible
        return True
    # Left
    visible = True
    for k in range(0, j):
        if grid[i][k] >= height:  # Higher tree, not visible from this side
            visible = False
            break
    if visible:  # We looped through everything without breaking, visible
        return True
    # Right
    visible = True
    for k in range(j + 1, n_cols):
        if grid[i][k] >= height:  # Higher tree, not visible from this side
            visible = False
            break
    if visible:  # We looped through everything without breaking, visible
        return True
    return False  # Not visible from any of the sides


for i in range(1, len(grid) - 1):  # Loop over grid values and find visible trees
    for j in range(1, len(grid[i]) - 1):
        height = grid[i][j]
        if is_visible(grid, i, j):
            # print(i, j)
            total_visible += 1


print(total_visible)
