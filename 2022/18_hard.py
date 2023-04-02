# Advent of code 2022 december the 18th, 2nd exercise

import numpy as np
from IPython import embed

input_file = "inputs/18_input_small.txt"
input_file = "inputs/18_input_medium.txt"
input_file = "inputs/18_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

# First find the max indices, so we can make the grid
max_coords = [0, 0, 0]
for line in lines:
    words = line.split(",")
    for i in range(len(words)):
        cord = int(words[i])
        if cord > max_coords[i]:  # Found new max for dimension "i".
            max_coords[i] = cord


# Task 18.1: Air is 0 and droplets are 2.
# Task 18.2: Reachable air is 0, unreachable air is 1, and droplets are 2.
# Now make the grid, loop over and mark 1 as droplet, 0 as air
# We gonna make an empty layer on each side, to more easily count the open sides.
# We plus every coordinate with 1 so that it gets moved to the middle
max_coords = [i + 3 for i in max_coords]  # Make grid one bigger to each 6 directions.
# ( + 1 for indexing starting at 0, then + 1 for each of the sides, plus and minus, resulting in + 3 ).
grid = np.ones(max_coords, dtype=int)  # Mark everything as unreachable first, then loop and find the reachable
rec_count = 0
for line in lines:
    words = line.split(",")
    x = int(words[0]) + 1  # The + 1 moves the droplets to the middle of the grid
    y = int(words[1]) + 1
    z = int(words[2]) + 1
    grid[x, y, z] = 2  # Mark lava in grid.


def find_neighbours(coords):
    """
    Returns the coordinates to the reachable neighbours, with respect to reachable air.
    This means that 1 is not yet visited air, 0 is already visited reachable air.
    Something is reachable if it is one of the six adjecent places from the point
    All coordinates are given as tuple of three ints
    """
    neighbours = []
    i, j, k = coords
    if i > 0 and grid[i - 1, j, k] == 1:  # Boundary and not-visited-air check
        neighbours.append((i - 1, j, k))
    if i < max_coords[0] - 1 and grid[i + 1, j, k] == 1:
        neighbours.append((i + 1, j, k))
    if j > 0 and grid[i, j - 1, k] == 1:
        neighbours.append((i, j - 1, k))
    if j < max_coords[1] - 1 and grid[i, j + 1, k] == 1:
        neighbours.append((i, j + 1, k))
    if k > 0 and grid[i, j, k - 1] == 1:
        neighbours.append((i, j, k - 1))
    if k < max_coords[2] - 1 and grid[i, j, k + 1] == 1:
        neighbours.append((i, j, k + 1))
    return neighbours


# Do breadth first search to find the reachable air
start = (0, 0, 0)
queue = [start]  # We start at 0, 0, 0, which we know is reachable air
grid[start] = 0
while (len(queue) > 0):
    current = queue.pop(0)
    neighbours = find_neighbours(current)
    for neighbour in neighbours:
        queue.append(neighbour)
        grid[neighbour] = 0  # Mark as air, or visited


def check_neighbours(grid, i, j, k):
    """
    Checks if coordinate of grid is air, and if so returns the amount of open surfaces
    neighbouring the coordinate, in all six directions
    """
    count = 0  # Number of open surfaces
    if grid[i, j, k] != 0:  # Not air, so will not give any open surfaces
        return 0
    if i > 0:  # Boundary check
        if grid[i - 1, j, k] == 2:
            count += 1
    if i < max_coords[0] - 1:
        if grid[i + 1, j, k] == 2:
            count += 1
    if j > 0:
        if grid[i, j - 1, k] == 2:
            count += 1
    if j < max_coords[1] - 1:
        if grid[i, j + 1, k] == 2:
            count += 1
    if k > 0:
        if grid[i, j, k - 1] == 2:
            count += 1
    if k < max_coords[2] - 1:
        if grid[i, j, k + 1] == 2:
            count += 1
    return count


# Count the open surfaces
surface_count = 0
for i in range(max_coords[0]):  # Loop over all of the dimensions
    for j in range(max_coords[1]):
        for k in range(max_coords[2]):
            # If air, look for open surface in all six directions
            surface_count += check_neighbours(grid, i, j, k)

print(surface_count)
