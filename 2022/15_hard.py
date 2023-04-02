# Advent of code 2022 december the 15th, 2nd exercise

import numpy as np
from IPython import embed

input_file = "inputs/15_input_small.txt"
input_file = "inputs/15_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

min_x = 0  # Store the smallest x-coordinate
max_x = 0  # Store the largest x-coordinate
pairs = []  # Store Sensor-Beacon pairs in lists, [s_x, s_y, b_x, b_y]
for line in lines:
    words = line.split()
    s_x = int(words[2].strip("x=").strip(","))
    s_y = int(words[3].strip("y=").strip(":"))
    b_x = int(words[8].strip("x=").strip(","))
    b_y = int(words[9].strip("y=").strip())
    pairs.append([s_x, s_y, b_x, b_y])
    for x in [s_x, b_x]:
        if x < min_x:  # Look for the lowest x-coordinate
            min_x = x
        if x > max_x:  # And the highest x-coordinate
            max_x = x


def manhattan_distance(coord1, coord2):
    """
    Get manhattan distance between coord1 ([x, y]) and coord2 ([x, y])
    """
    dist = abs(coord1[0] - coord2[0]) + abs(coord1[1] - coord2[1])
    return dist


# Solution is pretty brute force, but a lot of optimaziation is done compared to real brute-force
max_size = 4000000
for line_index in range(max_size):
    if line_index % 10000 == 0:
        print(f"{line_index=}")
    x = 0
    condition = True
    while(condition):
        restart = False
        for pair in pairs:
            if x > max_size:  # Already over the amount we are interested in
                break
            if restart:  # Each time we find a new sensor in range, look at all sensors again
                break
            sensor = [pair[0], pair[1]]
            beacon = [pair[2], pair[3]]
            sb_dist = manhattan_distance(sensor, beacon)  # Find distance to nearest beacon
            point_dist = manhattan_distance([x, line_index], sensor)
            if point_dist <= sb_dist:  # Within range, skip as many positions as possible
                # Go to end of sensors range
                y_dist = abs(sensor[1] - line_index)
                x_dist = x - sensor[0]  # Might be negative! That means sensor is right of x-point
                x_step = sb_dist - x_dist - y_dist + 1
                x += x_step
                restart = True
        if not restart:  # We have not looked at any new sensors for the x value, continue
            condition = False
    if x < max_size:
        final_x = x
        final_y = line_index
        break

print(final_x, final_y)
print(max_size * final_x + final_y)
