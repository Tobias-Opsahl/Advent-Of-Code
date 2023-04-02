# Advent of code 2022 december the 9th, 1st exercise

input_file = "inputs/9_input_small.txt"
input_file = "inputs/9_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

# Going for a bad complexity solution, each visted is marked in a dictionary.
# I am using dictionary instead of list since the complexity of "in" is better.
# A nested list grid would be better, but we do not know the size of the grid
# in advance. It could be made and dynamically enlarged.
visited = {"0 0": True}  # 0 0 marks the starting position for the tail
head_pos = [0, 0]  # Position of the head, [row, col]
tail_pos = [0, 0]  # Up and right is positive direction


def update_tail(head_pos, tail_pos, visited):
    """
    Given the current head and tail position, determines if the tail needs to be moved
    and updates the visited dict.
    """

    # Up
    if (head_pos[0] - tail_pos[0]) >= 2:
        tail_pos[0] += 1  # Move one step up
        if (head_pos[1] - tail_pos[1]) >= 1:
            tail_pos[1] += 1  # Also move right (diagonally)
        elif (head_pos[1] - tail_pos[1]) <= -1:
            tail_pos[1] -= 1  # Also move left (diagonally)

    # Down
    elif (head_pos[0] - tail_pos[0]) <= -2:
        tail_pos[0] -= 1  # Move one step down
        if (head_pos[1] - tail_pos[1]) >= 1:
            tail_pos[1] += 1  # Also move right (diagonally)
        elif (head_pos[1] - tail_pos[1]) <= -1:
            tail_pos[1] -= 1  # Also move left (diagonally)

    # Left
    elif (head_pos[1] - tail_pos[1]) <= -2:
        tail_pos[1] -= 1  # Move one step left
        if (head_pos[0] - tail_pos[0]) >= 1:
            tail_pos[0] += 1  # Also move up (diagonally)
        elif (head_pos[0] - tail_pos[0]) <= -1:
            tail_pos[0] -= 1  # Also move down (diagonally)

    # Right
    elif (head_pos[1] - tail_pos[1]) >= 2:
        tail_pos[1] += 1  # Move one step up
        if (head_pos[0] - tail_pos[0]) >= 1:
            tail_pos[0] += 1  # Also move up (diagonally)
        elif (head_pos[0] - tail_pos[0]) <= -1:
            tail_pos[0] -= 1  # Also move down (diagonally)

    # Update visited dictionary
    coords = str(tail_pos[0]) + " " + str(tail_pos[1])
    if coords not in visited:
        visited[coords] = True

    return tail_pos, visited


for line in lines:
    items = line.split()
    direction = items[0]
    count = int(items[1])

    # Looping over count first and checking direction in a function would look
    # nice, but require more if tests.
    if direction == "U":
        for _ in range(count):
            head_pos[0] += 1  # Update direction of head
            tail_post, visited = update_tail(head_pos, tail_pos, visited)
    elif direction == "D":
        for _ in range(count):
            head_pos[0] -= 1  # Update direction of head
            tail_post, visited = update_tail(head_pos, tail_pos, visited)
    elif direction == "L":
        for _ in range(count):
            head_pos[1] -= 1  # Update direction of head
            tail_post, visited = update_tail(head_pos, tail_pos, visited)
    elif direction == "R":
        for _ in range(count):
            head_pos[1] += 1  # Update direction of head
            tail_post, visited = update_tail(head_pos, tail_pos, visited)

# Caclulate amount of (unique) visits
total_visited = len(visited.keys())

print(total_visited)
