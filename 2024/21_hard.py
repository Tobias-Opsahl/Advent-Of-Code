from functools import cache
from random import random

number_matrix = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["X", "0", "A"],
]

direction_matrix = [
    ["X", "^", "A"],
    ["<", "v", ">"],
]


def find_index(character, matrix):
    for i, row in enumerate(matrix):
        if character in row:
            j = row.index(character)
            return [i, j]
    return -1


@cache
def get_path(start, end):
    start_indexes = find_index(start, direction_matrix)
    end_indexes = find_index(end, direction_matrix)
    matrix = direction_matrix
    if (start_indexes == -1 or end_indexes == -1):
        start_indexes = find_index(start, number_matrix)
        end_indexes = find_index(end, number_matrix)
        matrix = number_matrix
    [start_y, start_x] = start_indexes
    [end_y, end_x] = end_indexes
    dy = end_y - start_y
    dx = end_x - start_x
    movement_y = ""
    movement_x = ""
    if dy > 0:
        movement_y = "v" * dy
    elif dy < 0:
        movement_y = "^" * -dy
    if dx > 0:
        movement_x = ">" * dx
    elif dx < 0:
        movement_x = "<" * -dx

    # Avoid empty space
    if matrix[end_y][start_x] == "X":
        return movement_x + movement_y + "A"
    if matrix[start_y][end_x] == "X":
        return movement_y + movement_x + "A"
    if random() < 0.5:
        return movement_y + movement_x + "A"
    return movement_x + movement_y + "A"


@cache
def get_length(code, depth, s):
    if depth == 0:
        return len(code)
    prev_character = "A"
    for i in range(len(code)):
        character = code[i]
        s += get_length(get_path(prev_character, character), depth - 1, 0)
        prev_character = character
    return s


def get_length_simulated(code, depth):
    results = []
    for _ in range(1000):
        get_length.cache_clear()
        get_path.cache_clear()
        results.append(get_length(code, depth, 0))
    return min(results)


def run_all_codes(codes, max_depth):
    s = 0
    for code in codes:
        length = get_length_simulated(code, max_depth + 1)
        print(length)
        s += int(code[:-1]) * length
    return s


with open("inputs/21_input.txt") as infile:
    codes = infile.read().splitlines()

print(run_all_codes(codes, 25))
