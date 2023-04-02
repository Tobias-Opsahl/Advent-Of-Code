# Advent of code 2022 december the 2nd, 1st exercise

from IPython import embed

# input_file = "inputs/2_input_small.txt"
input_file = "inputs/2_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

total_points = 0

for line in lines:
    points = 0  # Points this turn
    values = line.split()
    opponent = values[0]  # Opponent choice, A (rock), B (paper), C (scissor)
    you = values[1]  # Your choice, X (rock), Y (paper), Z (scissor)

    # Points for your choice: Rock: 1, Paper: 2, Scissor: 3
    # Points for results: Loosing: 0, Draw: 3, Winning: 6

    if you == "X":
        points += 1
        if opponent == "A":  # Rock against rock, draw
            points += 3
        elif opponent == "B":  # Paper against rock, loose
            points += 0
        elif opponent == "C":  # Scissor against rock, win
            points += 6

    elif you == "Y":
        points += 2
        if opponent == "A":  # Rock against paper, win
            points += 6
        elif opponent == "B":  # Paper against paper, draw
            points += 3
        elif opponent == "C":  # Scissor against paper, loose
            points += 0

    elif you == "Z":
        points += 3
        if opponent == "A":  # Rock against scissor, loose
            points += 0
        elif opponent == "B":  # Paper against scissor, win
            points += 6
        elif opponent == "C":  # Scissor against scissor, draw
            points += 3

    # print(points)
    total_points += points

print(total_points)
