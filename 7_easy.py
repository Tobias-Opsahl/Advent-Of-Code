# Advent of code 2022 december the 7th, 1st exercise

input_file = "inputs/7_input_small.txt"
input_file = "inputs/7_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()

# Make files in tree structure
# Note that this is not minimally. I store the names of directories and files, which
# is not necessary for the tasks output. One just need to have a pointed to the parent directory,
# a way of identifying the directories and a size-parameter.


def update_size(cur_dir, size):
    """
    Recursivly update "cur_dir" size-argument, and all its parent directories, by "size".
    """
    while cur_dir["directory_name"] != "root":  # Go backwards until we reach the root
        cur_dir["size"] += size
        cur_dir = cur_dir["prev_dir"]

    cur_dir["size"] += size  # Also update root


root = {"size": 0, "directory_name": "root", "prev_dir": {"directory_name": "/"}}  # Tree structure of files and dirs
current_directory = root  # The directory we are currently in
all_dirs = {"root": root}  # Flat dict with all dirs

for line in lines:
    if line.strip() == "$ cd /":  # First line, do not consider
        continue

    if line[0] == "$":  # User command
        words = line.split()
        if words[1] == "cd" and words[2] == "..":  # Go back to previous directory
            current_directory = current_directory["prev_dir"]

        elif words[1] == "cd":  # Go into a new directory
            directory_name = words[2]
            prev_dir = current_directory

            if directory_name not in current_directory:  # We have not already made the sub-dir
                new_dir = {"directory_name": directory_name, "size": 0, "prev_dir": prev_dir}
                current_directory[directory_name] = new_dir  # Make new dict

                new_name = directory_name + "_" + current_directory["directory_name"]
                all_dirs[new_name] = current_directory[directory_name]  # Add to flat-structure

            current_directory = current_directory[directory_name]

    elif line[0] == "d":  # Directory, do not consider it because we only add when cd-ing the dir
        pass

    else:  # Number and filename. Assume they are unique.
        items = line.split()
        size = int(items[0])
        filename = items[1]
        current_directory[filename] = size  # Not necessary to store this
        update_size(current_directory, size)

# Find the folders with less than size 100000 and sum them
total_sum = 0
max_size = 100000
for key in all_dirs.keys():  # All of our directories in a flat structure
    size = all_dirs[key]["size"]  # The directorys size
    if size <= max_size:
        total_sum += size

print(total_sum)
