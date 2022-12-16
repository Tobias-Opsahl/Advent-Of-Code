# Advent of code 2022 december the 8th, 2nd exercise

input_file = "inputs/8_input_small.txt"
input_file = "inputs/8_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

grid = []  # Grid of the tree-heights, [row][col]
for line in lines:
    grid.append(list(line.strip()))  # Not necessary to turn into a list, can be string


def scenetic_score(grid, i, j):
    """
    Calculates the scenetic score, the product of trees seen in each direction.
    """
    n_rows = len(grid)
    n_cols = len(grid[0])
    height = grid[i][j]
    # Check visibility from all of the angles
    # Up
    up_count = 0
    for k in range(i - 1, -1, -1):  # Loop inwards and out
        up_count += 1
        if grid[k][j] >= height:  # Higher tree, not visible from this side
            break
    # Down
    down_count = 0
    for k in range(i + 1, n_rows):
        down_count += 1
        if grid[k][j] >= height:  # Higher tree, not visible from this side
            break
    # Left
    left_count = 0
    for k in range(j - 1, -1, -1):
        left_count += 1
        if grid[i][k] >= height:  # Higher tree, not visible from this side
            break
    # Right
    right_count = 0
    for k in range(j + 1, n_cols):
        right_count += 1
        if grid[i][k] >= height:  # Higher tree, not visible from this side
            break
    # print(up_count, down_count, left_count, right_count)
    return up_count * down_count * left_count * right_count


max_score = 0

for i in range(1, len(grid) - 1):  # Loop over grid values and find visible trees
    for j in range(1, len(grid[i]) - 1):
        height = grid[i][j]
        new_score = scenetic_score(grid, i, j)
        # print(i, j, new_score)
        if new_score > max_score:
            max_score = new_score


print(max_score)
