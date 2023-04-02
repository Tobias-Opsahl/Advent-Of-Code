# Advent of code 2022 december the 16th, 1st exercise

import numpy as np
from IPython import embed

input_file = "inputs/16_input_small.txt"
# input_file = "inputs/16_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

valves = {}  # A valve is stored with "valve_name": [flow_rate, is_open, neighbour_valves_list]

# Read and store valves
for line in lines:
    words = line.split()
    valve_name = words[1]
    flow_rate = int(words[4].strip("rate=").strip(";"))
    to_valves = []
    for new_valve in words[9:]:
        to_valves.append(new_valve.strip(",").strip())
    valves[valve_name] = [flow_rate, False, to_valves]


minutes = 10
start = "AA"


def add_flow(open_valves):
    new_points = 0
    for open_valve in open_valves:
        new_points += valves[open_valve][0]
    return new_points


def exhaustive_search(current, minutes, flow_score, open_valves, total_scores):
    """
    Search for optimal flow-output
    """
    if minutes == 0:
        print(flow_score)
        # return total_scores
        return flow_score
    if valves[current][0] > 0 and not valves[current][1]:  # Not worth to try to open broken valves
        open_valves.append(current)  # Add new valve to open-list
        valves[current][1] = True  # Mark valve as open
        flow_score += add_flow(open_valves)  # Update valve score
        exhaustive_search(current, minutes - 1, flow_score, open_valves, total_scores)
    for new_valve in valves[current][2]:
        flow_score += add_flow(open_valves)
        exhaustive_search(new_valve, minutes - 1, flow_score, open_valves, total_scores)


exhaustive_search(start, minutes, 0, [], [])
embed()
