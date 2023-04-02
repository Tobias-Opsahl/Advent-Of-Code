# Advent of code 2022 december the 20th, 1st exercise

input_file = "inputs/20_input_small.txt"
input_file = "inputs/20_input.txt"

with open(input_file) as infile:
    lines = infile.readlines()


# Start by using python list. The best data structure to use here is probably
# circular link list, but I will start simple.
# lines = [2, 0, 0, 0, 0, 0, 0, 0, 2]
numbers = []
for line in lines:
    number = float(line)
    added = False
    while(not added):
        if number not in numbers:
            numbers.append(number)
            added = True
        else:  # Easy workaround to combat duplicates
            if number >= 0:
                number += 0.11
            else:  # Negative number
                number -= 0.1


def get_index(number_list, index):
    """
    Returns the element at the index number "index" in the circular list "number_list"
    """
    index = index % len(number_list)
    return number_list[index]


def move(number_list, index):
    """
    Moves the element at position "index" in the circular list "number_list".
    It is moved the same amount of times as it value is.
    This is done in-place.
    """
    length = len(number_list)
    find_index = index % length
    element = number_list.pop(find_index)  # Remove and get element
    # Note that number list has one less element now, but we want that
    new_index = (find_index + int(element)) % len(number_list)  # Places that it should be moved to
    if new_index == 0:  # Somehow, this is a rule, which can be seen from the example 
        #  (does not matter in the final output though)
        new_index = length - 1
    # if new_index == length - 1:
    #     new_index = 0
    number_list.insert(int(new_index), element)
    return number_list


# Do the "mixing"
original_order = numbers.copy()  # Copy the order we will "mix" the elements
for i in range(len(original_order)):
    index = numbers.index(original_order[i])
    # print(numbers, original_order[i], index)
    move(numbers, index)

# Now we have done the mixing, lets calculate the correct output
index0 = numbers.index(0)  # We need to start from here
value1 = get_index(numbers, 1000 + index0)
value2 = get_index(numbers, 2000 + index0)
value3 = get_index(numbers, 3000 + index0)
# print(value1, value2, value3)
print(int(value1 + value2 + value3))
