# Advent of code 2022 december the 17th, 1st exercise

import numpy as np
from IPython import embed

input_file = "inputs/17_input_small.txt"
input_file = "inputs/17_input.txt"

with open(input_file) as infile:
    lines = infile.read()


width = 7
start_depth = 1
grid = [[2 for _ in range(width)] for _ in range(start_depth)]

space = [[0 for _ in range(width)] for _ in range(3)]

shapes = []

shape1 = [[0 for _ in range(width)] for _ in range(1)]
shape1[0][2] = 1
shape1[0][3] = 1
shape1[0][4] = 1
shape1[0][5] = 1

shape2 = [[0 for _ in range(width)] for _ in range(3)]
shape2[0][3] = 1
shape2[1][2] = 1
shape2[1][3] = 1
shape2[1][4] = 1
shape2[2][3] = 1

shape3 = [[0 for _ in range(width)] for _ in range(3)]
shape3[0][4] = 1
shape3[1][4] = 1
shape3[2][2] = 1
shape3[2][3] = 1
shape3[2][4] = 1

shape4 = [[0 for _ in range(width)] for _ in range(4)]
shape4[0][2] = 1
shape4[1][2] = 1
shape4[2][2] = 1
shape4[3][2] = 1

shape5 = [[0 for _ in range(width)] for _ in range(2)]
shape5[0][2] = 1
shape5[0][3] = 1
shape5[1][2] = 1
shape5[1][3] = 1

shapes = [shape1, shape2, shape3, shape4, shape5]

embed()
