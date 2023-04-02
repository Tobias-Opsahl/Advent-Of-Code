# Advent of code 2022 december the 9th, 2nd exercise

from IPython import embed

input_file = "inputs/9_input_small.txt"
input_file = "inputs/9_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

# Going for a bad complexity solution, each visted is marked in a dictionary.
# I am using dictionary instead of list since the complexity of "in" is better.
# A nested list grid would be better, but we do not know the size of the grid
# in advance. It could be made and dynamically enlarged.
visited = {"0 0": True}  # 0 0 marks the starting position for the tail
rope_length = 10
# coords are [row, col] where up and right are positive directions
rope_pos = [[0, 0] for _ in range(rope_length)]  # The first is head and last is tail
n = rope_length  # Saves some characters in the later loops, makes it more readable


def update_rope(first_pos, second_pos, visited=None):
    """
    Given the current position of any two neighbouring parts of the rope, "first_pos"
    and "second_pos", the second_pos will be updated to follow the first one.
    If "visited" is not None, it should be the visited-dictionary, and will be updated.
    In otherwrods, iff "second_pos" is the real tail, visited should be not None.
    """

    # Up
    if (first_pos[0] - second_pos[0]) >= 2:
        second_pos[0] += 1  # Move one step up
        if (first_pos[1] - second_pos[1]) >= 1:
            second_pos[1] += 1  # Also move right (diagonally)
        elif (first_pos[1] - second_pos[1]) <= -1:
            second_pos[1] -= 1  # Also move left (diagonally)

    # Down
    elif (first_pos[0] - second_pos[0]) <= -2:
        second_pos[0] -= 1  # Move one step down
        if (first_pos[1] - second_pos[1]) >= 1:
            second_pos[1] += 1  # Also move right (diagonally)
        elif (first_pos[1] - second_pos[1]) <= -1:
            second_pos[1] -= 1  # Also move left (diagonally)

    # Left
    elif (first_pos[1] - second_pos[1]) <= -2:
        second_pos[1] -= 1  # Move one step left
        if (first_pos[0] - second_pos[0]) >= 1:
            second_pos[0] += 1  # Also move up (diagonally)
        elif (first_pos[0] - second_pos[0]) <= -1:
            second_pos[0] -= 1  # Also move down (diagonally)

    # Right
    elif (first_pos[1] - second_pos[1]) >= 2:
        second_pos[1] += 1  # Move one step up
        if (first_pos[0] - second_pos[0]) >= 1:
            second_pos[0] += 1  # Also move up (diagonally)
        elif (first_pos[0] - second_pos[0]) <= -1:
            second_pos[0] -= 1  # Also move down (diagonally)

    # Update visited dictionary
    if visited is not None:  # This assumes the second_pos is the real tail
        coords = str(second_pos[0]) + " " + str(second_pos[1])
        if coords not in visited:
            visited[coords] = True
        return second_pos, visited
    else:
        return second_pos


for line in lines:
    items = line.split()
    direction = items[0]
    count = int(items[1])

    # Looping over count first and checking direction in a function would look
    # nice, but require more if tests.
    if direction == "U":
        for _ in range(count):
            rope_pos[0][0] += 1  # Update position of head, first part of rope
            for i in range(1, n - 1):  # Update rope position, except head and tail
                rope_pos[i] = update_rope(rope_pos[i - 1], rope_pos[i])
            rope_pos[n - 1], visited = update_rope(rope_pos[n - 2], rope_pos[n - 1], visited)
    elif direction == "D":
        for _ in range(count):
            rope_pos[0][0] -= 1  # Update position of head, first part of rope
            for i in range(1, n - 1):  # Update rope position, except head and tail
                rope_pos[i] = update_rope(rope_pos[i - 1], rope_pos[i])
            rope_pos[n - 1], visited = update_rope(rope_pos[n - 2], rope_pos[n - 1], visited)
    elif direction == "L":
        for _ in range(count):
            rope_pos[0][1] -= 1  # Update position of head, first part of rope
            for i in range(1, n - 1):  # Update rope position, except head and tail
                rope_pos[i] = update_rope(rope_pos[i - 1], rope_pos[i])
            rope_pos[n - 1], visited = update_rope(rope_pos[n - 2], rope_pos[n - 1], visited)
    elif direction == "R":
        for _ in range(count):
            rope_pos[0][1] += 1  # Update position of head, first part of rope
            for i in range(1, n - 1):  # Update rope position, except head and tail
                rope_pos[i] = update_rope(rope_pos[i - 1], rope_pos[i])
            rope_pos[n - 1], visited = update_rope(rope_pos[n - 2], rope_pos[n - 1], visited)
# Caclulate amount of (unique) visits
total_visited = len(visited.keys())

print(total_visited)

embed()
