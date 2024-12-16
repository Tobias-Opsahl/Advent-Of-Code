# Advent of code 2022 december the 12th, 2nd exercise

from IPython import embed
import numpy as np  # Easier to do with arrays

input_file = "inputs/12_input_small.txt"
input_file = "inputs/12_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

n_cols = len(lines[0].strip())
n_rows = len(lines)

grid = np.zeros((n_rows, n_cols), dtype="int")  # Initialize grid for terrain values
# Down and Right is positive direction


def convert_to_int(letter):
    """
    Convert to terrain characters to int values.
    The values goes from 1 to 26. This is strictly not necessary, but I prefer it.
    """
    if letter == "S":  # Start
        return 1
    elif letter == "E":  # End
        return 26
    value = ord(letter) - 96
    return value


start_indices = [0, 0]
end_indices = [0, 0]

# Read input and convert to grid
for i, line in enumerate(lines):
    for j, character in enumerate(line.strip()):
        if character == "E":  # Mark the end index
            end_indices = [i, j]
        grid[i, j] = convert_to_int(character)


# Help function for finding neighbours
def find_neighbours(grid, i, j):
    """
    Find the neighbours we can go to from position grid[i, j].
    Check if we can traverse to all directions, and return neighbours
    as a list of indices ([row_index, col_index]).
    """
    neighbours = []
    # Up
    if i - 1 >= 0:  # Check if not out-of-bound
        if (grid[i - 1, j] - grid[i, j]) <= 1:  # Check if to too high
            neighbours.append([i - 1, j])
    # Down
    if i + 1 <= n_rows - 1:  # Check if not out-of-bound
        if (grid[i + 1, j] - grid[i, j]) <= 1:  # Check if to too high
            neighbours.append([i + 1, j])
    # Left
    if j - 1 >= 0:  # Check if not out-of-bound
        if (grid[i, j - 1] - grid[i, j]) <= 1:  # Check if to too high
            neighbours.append([i, j - 1])
    # Right
    if j + 1 <= n_cols - 1:  # Check if not out-of-bound
        if (grid[i, j + 1] - grid[i, j]) <= 1:  # Check if to too high
            neighbours.append([i, j + 1])
    return neighbours


# Begin breath-first search.
# Store the to-be-visited queue as a python-list
# Store a visited-grid to check if we have been to a node before.
# This is in a nested python list, so that "0" marks unvisited,
# and visited is marked with the indices of the node that brought us there ([row, col]).
# The start node is marked by "1".
# Store the grid values as [row_index, col_index] in the queue.
# The "grid" has the height of the nodes, which find_neigbours manages.

shortest_path = 100000  # Start at + inf

for i in range(n_rows):
    for j in range(n_cols):
        if grid[i, j] == 1:  # Only accept starting point if it starts at the lowest elivation

            start_indices = [i, j]  # Loop over the different starting points
            condition = True  # Meaning we should continue to search
            queue = [start_indices]
            visited = [[0 for _ in range(n_cols)] for _ in range(n_rows)]  # Nested visited structure
            visited[start_indices[0]][start_indices[1]] = 1  # Mark the starting point as visited
            while (condition and len(queue) > 0):
                current = queue.pop(0)  # Pop _first_ element in list
                if current == end_indices:
                    condition = False  # This marks that we have found a solution
                    break
                else:
                    neighbours = find_neighbours(grid, current[0], current[1])
                    for neighbour in neighbours:
                        if visited[neighbour[0]][neighbour[1]] == 0:
                            queue.append(neighbour)
                            visited[neighbour[0]][neighbour[1]] = current

            # Backtrack v2
            if not condition:  # We might not have a solution, so test if we finished first.
                current = end_indices
                path = []
                while (current != 1):  # Count the length of the path
                    path.insert(0, current)
                    current = visited[current[0]][current[1]]
                if (len(path) - 1) < shortest_path:  # Check if we found a shorter path
                    shortest_path = len(path) - 1

print(shortest_path)
