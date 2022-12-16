# Advent of code 2022 december the 10th, 2nd exercise

from IPython import embed

input_file = "inputs/10_input_small.txt"
input_file = "inputs/10_input_medium.txt"
input_file = "inputs/10_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

X = 1  # The value of X
n_cycle = 0  # The number of cycle we are in
total_sum = 0  # The sum we want to calculate
draw_line = ""


def advance(n_cycle, X, x_count, draw_line):
    """
    Given an n_cycle, X, x_count and total_sum, advances one step.
    If X should not advance, set it x_count to 0.
    """
    draw_count = n_cycle % 40
    if draw_count in [X - 1, X, X + 1]:
        draw_line += "#"
    else:
        draw_line += "."
    n_cycle += 1
    X += x_count
    if n_cycle % 40 == 0:  # Check if we are at a critical point
        print(draw_line)
        draw_line = ""

    return n_cycle, X, draw_line


for line in lines:
    if line.strip() == "noop":  # Advance one cycle
        n_cycle, X, draw_line = advance(n_cycle, X, 0, draw_line)

    else:  # addx, Do the two cycles in this block
        x_count = int(line.split()[1])
        n_cycle, X, draw_line = advance(n_cycle, X, 0, draw_line)
        n_cycle, X, draw_line = advance(n_cycle, X, x_count, draw_line)
