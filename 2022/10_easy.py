# Advent of code 2022 december the 10th, 1st exercise

from IPython import embed

input_file = "inputs/10_input_small.txt"
input_file = "inputs/10_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

X = 1  # The value of X
n_cycle = 1  # The number of cycle we are in
total_sum = 0  # The sum we want to calculate


def advance(n_cycle, X, x_count, total_sum):
    """
    Given an n_cycle, X, x_count and total_sum, advances one step.
    If X should not advance, set it x_count to 0.
    """
    n_cycle += 1
    X += x_count
    if (n_cycle == 20) or ((n_cycle - 20) % 40 == 0):  # Check if we are at a critical point
        total_sum += X * n_cycle

    return n_cycle, X, total_sum


for line in lines:
    if line.strip() == "noop":  # Advance one cycle
        n_cycle, X, total_sum = advance(n_cycle, X, 0, total_sum)

    else:  # addx, Do the two cycles in this block
        x_count = int(line.split()[1])
        n_cycle, X, total_sum = advance(n_cycle, X, 0, total_sum)  # First advance without changing X
        n_cycle, X, total_sum = advance(n_cycle, X, x_count, total_sum)  # Then advance and change X
    # print(n_cycle, X)

print(total_sum)

embed()
