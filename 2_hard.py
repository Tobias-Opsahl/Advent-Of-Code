# Advent of code 2022 december the 2nd, 2nd exercise

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
    you = values[1]  # Your result, X (loose), Y (draw), Z (win)

    # Points for your choice: Rock: 1, Paper: 2, Scissor: 3
    # Points for results: Loosing: 0, Draw: 3, Winning: 6

    if you == "X":  # Need to loose
        points += 0
        if opponent == "A":  # Opponent chose rock, you have to choose scissor
            points += 3
        elif opponent == "B":  # Opponent chose paper, you have to chose rock
            points += 1
        elif opponent == "C":  # Opponent chose scissor, you have to chose paper
            points += 2

    elif you == "Y":  # Need to draw
        points += 3
        if opponent == "A":  # Opponent chose rock, you have to choose rock
            points += 1
        elif opponent == "B":  # Opponent chose paper, you have to chose paper
            points += 2
        elif opponent == "C":  # Opponent chose scissor, you have to chose scissor
            points += 3

    elif you == "Z":  # Need to win
        points += 6
        if opponent == "A":  # Opponent chose rock, you have to choose paper
            points += 2
        elif opponent == "B":  # Opponent chose paper, you have to chose scissor
            points += 3
        elif opponent == "C":  # Opponent chose scissor, you have to chose rock
            points += 1

    # print(points)
    total_points += points

print(total_points)
