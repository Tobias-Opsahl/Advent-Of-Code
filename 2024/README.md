# 2024

This year's exercises were solved with Javascript and node.js, in order to learn Javascript which I had no prior experience with. There are some repeated boilerplate code for reading and processing the input found in `boilerplate.js` (this could have been implemented in a more general way of course).
The tasks were mostly solved the morning of the respective releases. Speed was not an objective, but generally good codestyle was. Tasks vary between being efficient and brute-forced. With a few exceptions, the tasks were solved without any help or inspiration.
**Tasks were help was used:** Day 17 part 2 (3 bit Turing machine), day 21 part 2 (recursive keypads) and day 24 part 2 (ripple-carry adder analysis). Day 21 part 2 is the only task not used using Javascript. I used Python and `functool`'s cache in order to do recursion with memoization.

## Day 1

- Task: Historical lists
  - Part 1: Given two lists, sort them and compute the difference between the respective elements.
  - Part 2: Instead of computing the differences, get the similarity score, which is the amount of times a number in the left list is repeated in the right list, for each number in the left list.
- Solution:
  - Part 1: Sort the lists and loop over the elements and compute the differences.
  - Part 2: Loop over the left list and count the amount of time the element appears on the right.

## Day 2

- Task: Safe reports
  - Part 1: Check if lines of numbers are safe if they are strictly monotone, either always decreasing or increasing with at least 1 and at most 3.
  - Part 2: Allow the removal of one number.
- Solution:
  - Part 1: Loop over the numbers and check if each increment is on the valid format, either increasing or decreasing.
  - Part 2: If a number is not on the correct format, try to remove it, the left and the right number and see if the line now is on the correct format. This could more easily have been brute forced by just trying to remove each number since the lists are short, but this tests only the removal of numbers that might have made a difference.

## Day 3

- Task: Multiplication instructions
  - Part 1: In a long string, find syntactly correctly multiply-statement, multiply the numbers and sum all of them.
  - Part 2: Now include `do()` and `don't()` blocks. Only perform multiplications inside the `do()` blocks.
- Solution:
  - Part 1: Find the multiplication statements with regex and parse the numbers, multiply and sum.
  - Part 2: First use regex to find the inside of the `do()` blocks, then use regex as in part 1 to find the multiplication statements inside. Spent some time on getting the newline and regex syntax in Javascript correct, had some trouble since the input was on multiple lines and the regex did not account for that.

## Day 4

- Task: XMAS word search
  - Part 1: Find the `XMAS` inputs, in either directions and including diagonals, in a word search.
  - Part 2: Find the amount of `MAS` in and `X` formations instead.
- Solution:
  - Part 1: Loop over rows, columns and diagonals and check for `XMAS` and `SMAX` with regex. Spent some time correctly looping over the diagonals correctly.
  - Part 2: Loop over every 3x3 block and check if it contains an X-MAS (middle must be `A`, the diagonals must be `MAS` or `SAM`).

## Day 5

- Task: Page ordering
  - Part 1: Given many rules of pairs of page numbers marking which page must be before the other, evaluate how many lists of page numbers that obey the rules.
  - Part 2: Sort the page number orders that do not obey the rules, so that they do obey the rules.
- Solution:
  - Part 1: Make a map of the rules with pagenumbers as keys, and a list of pages that must come before the page number as the value. Loop over the page numbers in the orders and test if any of the page numbers appearing before it also appears in the value in the rule map. If so, it is not allowed, and the order is not valid.
  - Part 2: Inefficient nested loop solution. While the order is not sorted according to the rules, loop over until a page number that does not obey the rule. Move it forward until it obeys the rules. Iterate through the whole list of orders in this way, and repeat iterating (in the while loop) until the list is in the correct order.
- Possible improvements: Instead of doing a while loop that has a nested for loop over the page numbers, find a rule of how to move the incorrectly placed page orders in one sweep. I tried doing this, but it ended up not entirely correct, since it was not clear to me how to sort when there were many possible orders of the same elements.

## Day 6

- Task: Moving guard
  - Part 1: Simulate a guard moving in a 2d grid. If it hits an obstacle, it turns right. Find the length of the path before it moves off the grid.
  - Part 2: Find out how many single object placements that can be made to make the guard enter an infinite loop.
- Solution:
  - Part 1: Simply simulate the guards movements in a grid, and mark which tiles that have been visited.
  - Part 2: Iterate over all tiles, try placing an object there, and simulate the guard moving. In the simulation, mark the visited position and the orientation of the guard, and if a tile has been visited with the same orientation, terminate the simulation marking an infinite loop. Mark the visited grid with the orientation (0, 1, 2 or 3 representing right, down, left and up) when the tile was visited.
- Possible improvement: Instead of looping over every tile and trying to place an obstacle there, place obstacles only in the path that the guard originally makes.

## Day 7

- Task: Bridge repair by finding operations
  - Part 1: Given a sum and some numbers, test if the sum can be calculated by evaluating the numbers left to right and for each step either plussing or multiplying the numbers.
  - Part 2: In addition to addition and multiplication, also try concatenation.
- Solution:
  - Part 1: Iterate over a binary list of the same length as the amount of operations. Represent one operation with 0 and the other with 1. Try if the operation results in the sum, and if not iterate the binary list to the next number.
  - Part 2: Extend the binary list to have digits 0, 1 and 2, instead of only 0 and 1. The digit 2 now represents concatenation.

## Day 8

- Task: Antenna frequencies
  - Part 1: Given a 2d map of antennas, calculate frequencies which are mirrored by the position of two antennas of the same type. The signals are located with the same distance from the antennas as the antennas are placed from each other.
  - Part 2: The frequencies instead continue in the same line throughout the whole grid.
- Solution:
  - Part 1: Find groups of antennas. For each pair of the same type of antenna, do some grid calculations to find where the signal should be placed.
  - Part 2: Do the same, but loop over the line and place signals within the border of the grid.

## Day 9

- Task: Compress files
  - Part 1: First decompress files by interpreting a string of integers as alternating files and empty spaces. Given a line with files (represented by numbers) and empty spaces, move all files from the right to the first empty space at the left.
  - Part 2: Do not split up files, that is, positions with the same number in one block. Try to move them to the first possible open space of the correct size, and do not move if no such space exists.
- Solution:
  - Part 1: Simulate the decompressing and moving of files iteratively.
  - Part 2: Similarly update the disk iteratively, but manage the size of the files and look for empty spaces of same or larger size by short nested loops.

## Day 10

- Task: Trail maps
  - Part 1: Find the possible trail tops marked with a 9 in a 2d grid reachable from a tile marked with 0, where one is only allowed to move in four directions and to a tile that is exactly one higher than the current tile.
  - Part 2: Find the amount of unique paths going from 0 to 9, even if it is the same 0 and 9.
- Solution:
  - Part 1: Pretty simple recursive breadth first search (BFS), stopping the search if a tile is not an increment of one. Keep a visited array over visited tiles, and do not revisit nodes.
  - Part 2: Simply modify part 1 to not mark nodes as visited, which allows revisits and finds all paths.

## Day 11

- Task: Numbered stones
  - Part 1: There is a line of numbered stones, which changes according to some rules at every blink. Simulate 25 blinks.
  - Part 2: Simulate 75 blinks.
- Solution:
  - Part 1: Simply store a list of the stones and update all stones at each blink.
  - Part 2: Store a map from the stone number to the amount of stones of that number, instead of the full list. The stones multiply and therefore increase exponentially, and therefore it is not possible to store the full list. Since many stones reset to 0 and follow the same rules, most of the stones in the list are duplicates, and there are not many unique stones. For each blink, simply calculate the rules for each stone number ones, and multiply by the amount of stones and update the map.

## Day 12

- Task: Fences of gardens
  - Part 1: Given a 2d grid with different gardens marked with different letters, find the length of the fences needed to separate the gardens.
  - Part 2: Find the amount of edges in each fence, disregarding the lengths.
- Solution:
  - Part 1: Find the gardens. For each garden, iterate over the tile and determine how many fences each tile needs, based on whether neighbour tiles are part of the same garden or not.
  - Part 2: Very messy solution with many if-checks. Tried to somewhat elegantly find the amount of corners instead of edges (since this is the same), but this ended up more complex than my initial solution, which was to walk around the fence and count each rotation. It got further complex by iterating over the edges of the garden tiles, instead of the garden tiles themselves. For each fence tile, make if test that determines the amount of corners the fence makes by checking the neighbours.
- Possible improvements: Find corners by checking the garden tiles instead of the fence tiles. Alternatively, walk around the fence and count the amount of rotations instead.

## Day 13

- Task: Claw machine equations.
  - Part 1: Claw machines have two buttons, moving the claw a certain fields in the x and y directions. A prize is placed in a certain position. Find out which prizes are reachable within 100 presses (also find the "cheapest" way of doing so, but this is somewhat a red herring since there are at most one solution).
  - Part 2: Do the same, but with much higher values for the position of the prizes.
- Solution:
  - Part 1: Simply iterate over all combinations of the button presses within 100 and see which prize is reachable.
  - Part 2: Solve the simple set of equations with two unknowns. If the solution is not an integer or not positive, no solution is found. No inputs were linearly dependent.

## Day 14

- Task: Moving restroom robots
  - Part 1: Simulate robots moving in a 2d grid.
  - Part 2: Find the frame where the robots make a drawing of a christmas tree.
- Solution:
  - Part 1: For each step, make a new grid and iterate over all the robots and move them with their respective velocities.
  - Part 2: Search for "#######" in a frame, if so, print the frame number and frame. Also possible to print everything to file and ctrl + f "######". I did some failed attempts at trying to find the christmas tree by searching for symmetric constructions and outlined borders.

## Day 15

- Task: Box moving warehouse robot.
  - Part 1: Simulate a robot moving in a 2d environment. If it hits any walls, it will turn, and if it hits any boxes, it will push them until they are pushed into a wall.
  - Part 2: The same as part 1, but now the boxes are twice as wide, and if one part of the boxes are pushed, the whole box is moved.
- Solution:
  - Part 1: Iterate over movements and move robots. If a box is encountered, try to loop in the direction of the movement until a wall is found (nothing is moved, robot turns) or an empty space is found (all of the boxes are moved one step backwards, or the first box is placed in the first empty space and the robot is placed in the first box's position).
  - Part 2: When a wide box is moved horizontally, not much is changed since they have a thickness of 1. When they are moved vertically, make a recursive call in the columns of the left and the right box position. If a new box is found in a recursive call, check if it is part of the neighbouring recursive call, the same, or will start a new one (if it pokes out to the side). If all of the calls end with an empty spot, move all boxes, if at least one ends with a wall, move none.

## Day 16

- Task: Reindeer maze
  - Part 1: Find the best score in a maze, where a move forward costs 1 and a rotation costs 1000.
  - Part 2: Find all tiles used in any path that achieves the best possible score.
- Solution:
  - Part 1: Pretty simple recursive breadth first search in all directions. The score counter is incremented with 1 if one moves the same direction, and 1001 if one turns. The visited array kept the minimal score obtained for a tile, and long paths were terminated early if they were slower than previous paths.
  - Part 2: The small trick here was to revisit a tile with a buffer of 1000, since it is possible to be in the same tile, but with a better rotation. The same BFS was used.

## Day 17

- Task: Simulate 3 bit Turing machine.
  - Part 1: Simulate a simple 3 bit Turing machine.
  - Part 2: Find input A to the Turing machine so that the output matches its input.
- Solution:
  - Part 1: Simple implementation of the Turing machine.
  - Part 2: I could not do this one by myself, and had to read up to understand the logic. After analysing the program, one can find out that the A modulo 8 gets outputted, and 8 gets divided by 8. The other inputs are irrelevant. Recursively find which number in (0, 7) that produces the correct last digit of instructions. Multiply numbers by 8 and find a number in (0, 7) that outputs the second to last digit of instructions, and so on.

## Day 18

- Task: Solve labyrinth of falling meteors in a grid.
  - Part 1: Find length of shortest path in 2d grid labyrinth.
  - Part 2: Find wall numbers that make the labyrinth unsolvable.
- Solution:
  - Part 1: BFS search. Also A-star with various heuristics, but since the start was at the upper left, and end was at the lower right, every move from the beginning went in the direction of the end, so a-star was not an improvement of BFS. I did this to repeat some algorithms I had not implemented in a little while.
  - Part 2: Iteratively add walls and check if BFS found a solution. Implement both with brute-force (add one and one) and binary search.
- Efficient and implementation: Yes.

## Day 19

- Task: Arrange towels.
  - Part 1: Given an array of string `towels`, count the amount of patterns in `patterns` (also strings) that can be created by combining strings in `towels`.
  - Part 2: Count the number of unique possible ways of making the strings in `patterns` with the strings from `towels`.
- Solution:
  - Part 1: Recursive search. Loop over `towels`, try to match it with the current pattern. If it works, remove the first part of the pattern corresponding to the towel and call the function recursively.
  - Part 2: Recursive search with memoization. Do the same as in task 1, but instead of aborting the search when a pattern is made, increment counter and continue searching for other ways. In order to make the complexity linear and not exponential, add memoization. When a subpattern is searched, add it and the amount of times it was matched to an object. When starting a search, first check if the subpattern is in that object and return the amount of times it was found if yes.
- Efficient implementation: Yes.

## Day 20

- Task: Find cheats in a 2d maze.
  - Part 1: Find the amount of possibilities to solve a 2d maze where you are allowed to skip over one wall. Count skips that saved over 100 steps.
  - Part 2: Same as above, but now one is allowed to skip up to 20 walls once. Two skips count as equal if they start and stop at the same non-wall tile.
- Solution:
  - Part 1: Solve the map with A-star (unnecessary, but copied from day 18). Loop over the maze and if it is a wall, remove it, solve with the new map and check if it is at least 100 steps faster than without the skip.
  - Part 2: First get the distances from the start in the map without cheats. Then loop over every combination of coordinates, and if they both are not a wall, and if the difference between the latter and the first minus manhattan distance is greater than 100, count the shortcut.

## Day 21

- Task: Move robots with pads.
  - Part 1: Given a code and a keypad, provide instructions on how to navigate the keypad with a different keypad. Repeat twice.
  - Part 2: Given a code and a keypad, provide instructions on how to navigate the keypad with a different keypad. Repeat twenty five times.
- Solution:
  - Part 1: Make the keypads as arrays. Make a function that finds the indexes given the symbol. Then, calculate the distances in y and x directions, and add moves accordingly. Make a special rule for avoiding the empty spaces. The fastest paths turned out to be non-trivial, so for every time there is a choice (both vertical and horizontal movement), do the vertical movements first with a 50% chance. Then, compute everything 100 times and choose the shortest path. Very hacky solution, but it worked.
  - Part 2: I needed a lot of help from the subreddit on this one. Switch to python, so I can easily cache recursive calls with `@cahce`. Instead of calculating the path for a whole sequence at a time, only do one step, and end with an "A". Somehow the random part of the program still worked, and I am not sure why. I am not entirely convinced that I understand the recursion happening here.
- Used help: Yes, a lot (part 2).

## Day 22

- Task: Calculate monkey banana prices
  - Part 1: Given some steps of calculating the next number in the sequence, calculate the 2000th number in sequence, for each initial number.
  - Part 2: The price is given by the last digit in the sequence from part 1. Find the single best sequence of four price *changes* that gives the highest price for all sequences. A price is given by the four price changes before it, if it is found in the sequence.
- Solution:
  - Part 1: Pretty straightforward calculation of the next number, then iterate 2000 times for each input and sum the last numbers.
  - Part 2: Super brute-force! For each sequence of price changes, loop over all the price sequences and calculate the total price. Took 5-10 minutes with a very non-optimized code.
- Possible efficiency improvements: In part 2, a slightly less brute force approach would be to only loop over price change sequences that actually appear in each sequence of price changes, and then store sequence: price pairs in a global map.
- Brute-force: Yes, very.

## Day 23

- Task: LAN connections.
  - Part 1: Find every three-clique of computers in networks, and return the amount that has at least one computer starting with "t".
  - Part 2: Find the largest n-clique in the graph.
- Solution:
  - Part 1: Find three cliques by checking if every connected node has a common node connection.
  - Part 2: Generalize the function from part 1 to make a list of k-cliques given a list of k-1-cliques. For every pair of k-1-cliques, check if there is exactly one node from each that is not in the other. If so, check if those two nodes have a connection. If yes, merge them and add them as a k-clique. Runs extremely slow.
- Efficient solution: No.
- Runs quickly: No, not at all.
- Brute force: Yes, extremely. Took about 30 minutes to run. Must be brute forced in some way (NP-complete problem), but the solution can still be improved by a lot.

## Day 24

- Task: Calculate and fix binary ripple-carry adder.
  - Part 1: Use given register values and logical operations to compute the results of all operations, and then output the `z`-registers sorted.
  - Part 2: The program is really supposed to perform binary addition with `x` and `y` into `z`, but in order to do that, four pairs of instructions must be swapped (eight are wrong). Find those and print them in sorted order.
- Solution:
  - Part 1: Simply read the input and perform the operations. The order is scrambled, so if any of the register values in the operation is not yet set, simply increment to next operations. Perform a while loop until all operations are performed.
  - Part 2: After looking up some help, I figured out this was a ripple-carry adder. The [Wikipedia page](https://en.wikipedia.org/wiki/Adder_(electronics)#Ripple-carry_adder) helped a lot, both about half adders, full adders and ripple-carry adders. I then made a program (inspired by another solution) that iterates over the operations, and based on what the input, operant and output is, determine if the rule is a mistake or not. This builds on the assumption that there are no unnecessary rules in the program.
- Used help: Yes, part two.
- Runs quickly.

## Day 25

- Task: Find possible key and lock pairs.
  - Part 1: Given a lock or key design in a grid, determine how many pairs of keys and lock pair that matches. They match if each column does not overlap.
  - Part 2: Get 49 stars.
- Solution:
  - Part 1: Read each key or lock as a grid and convert to integer representation, given by the amount of "#" in each column. Then simply iterate over all pairs of locks and grids and test if they match (they match if none of the columns exceed 5).
  - Part 2: :)
- Used help: No
- Runs quickly: Yes.
- :D
