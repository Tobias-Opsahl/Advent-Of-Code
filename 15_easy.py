# Advent of code 2022 december the 15th, 1st exercise

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


line_index = 10
line_index = 2000000
n_cols = max_x - min_x + 1  # Amout of points at the x axis
# We need to count on (-inf, inf) on the x-axis. We could calculate exactly how much
# space we need by the max distance, but I will just add n_cols on both sides
main_line = np.zeros(3 * n_cols, dtype=int)  # Store 0 for possible beacon, 1 for no possible beacon


def reindex(x):
    """
    Reindex x so that we will get the 0 index in the middle of the main_line array
    when we calculate distances.
    """
    return x + int(n_cols * 1.5)


for pair in pairs:
    sensor = [pair[0], pair[1]]
    beacon = [pair[2], pair[3]]
    sb_dist = manhattan_distance(sensor, beacon)  # Find distance to nearest beacon

    # Brute force solution: (This works but runs for a couple minutes)
    # for dot in range(len(main_line)):  # For every point on the line, check if it is closer to sensor than sb_dist
    #     dot = int(dot - n_cols * 1.5)  # Adjust so we loop in (-1.5 * n_cols, 1.5 * n_cols)
    #     line_dist = manhattan_distance([dot, line_index], sensor)
    #     if line_dist <= sb_dist:
    #         main_line[reindex(dot)] = 1

    # Smart way:
    # Caclulate the distance from the projection from the sensor straight down on the y-line of interest.
    # If this is bigger than sb_dist, no points will be mark. If it is smaller than sb_list, we will
    # mark the dot projected from the sensor down on the y-line, plus any dots of "overlap" amount of steps
    # to either side, left or right. "overlap" is set to sb_dist - y_dist, the amount of steps we can go
    # from the projected point that is less than sb_dist points away from the sensor.
    y_dist = abs(sensor[1] - line_index)  # Calculate distance from sensor straight down on our line
    overlap = sb_dist - y_dist
    if overlap >= 0:  # If less than 0, all points of no beacons are further away than our line
        # Mark every point to both sides of the point projected on the y line with 1, depending on overlap
        main_line[reindex(-overlap + sensor[0]): reindex(overlap + sensor[0] + 1)] = 1  # Vectorized
        # for i in range(-overlap, overlap + 1):  # Non-vectorized
        #     main_line[reindex(sensor[0] + i)] = 1

# Edge case for beacon being a the line. Remove actual becons from line.
for pair in pairs:
    beacon = [pair[2], pair[3]]
    if pair[3] == line_index:
        main_line[reindex(pair[2])] = 0  # Set possible for beacon of becaon is on line

print(main_line.sum())
