# 2024

This year's excersises will be mostly solved in Javascript and node.js, in order to learn the langauge. There are some repeated boilerplate code for reading and processing the input found in `boilerplate.js`. This could be used as a module for less copying.

**Day 17:**

- Task: Simulate 3bit Turing machine.
  - Part 1: Simulate simple 3 bit Turing machine.
  - Part 2: Find input A to Turing machine so that the output matches its input.
- Solution:
  - Part 1: Simple implemenation of the Turing machine.
  - Part 2: I could not do this one by myself, and had to read up to understand the logic. After analysing the program, one can find out that the A modulo 8 gets outputed, and 8 gets divided by 8. The other inputs are irrelevant. Recursivly find which number in (0, 7) that produces the correct last digit of instructions. Multiply number by 8 and find number in (0, 7) that outputs second to last digit of instructions, and so on.

**Day 18:**

- Task: Solve labyrinth of falling meteors in grid.
  - Part 1: Find length of shortest path in 2d grid labyrinth.
  - Part 2: Find wall number that makes the labyrinth unsolvable.
- Solution:
  - Part 1: BFS search. Also A-star with various heuristics, but since the start was a the upper left, and end was at the lower right, every move from the beginning went in the direction of the end, so a-star was not an improvement of BFS. I did this to repeat some algorithms I had not implemented in a little while.
  - Part 2: Iteratively add walls and check if BFS found a solution. Implement both with brute-force (add one and one) and binary search.
- Efficient and elegant implementation: Yes.

**Day 19:**

- Task: Arange towels.
  - Part 1: Given an array of string `towels`, count the amount of patterns in `patterns` (also strings) that can be created by combining strings in `towels`.
  - Part 2: Count the amount of unique possible ways of making the strings in `patterns` with the strings from `towels`.
- Solution:
  - Part 1: Recursive search. Loop over `towels`, try to match it with the current pattern. If it works, remove the first part of the pattern corresponding to the towel and call the function recursivly.
  - Part 2: Recursive search with memoization. Do the same as in task 1, but instead of aborting the search when a pattern is made, increment counter and continue searching for other ways. In order to make the complexity linear and not exponential, dd memoization. When a subpattern is searched, add it and the amount of times it was matched to an object. When starting a search, first check if the subpattern is in that object and return the amount of times it was found if yes.
- Efficient and elegant implementation: Yes.

**Day 20:**

- Task: Find cheats in 2d maze.
  - Part 1: Find amount of possibilities to solve 2d maze where you are allowed to skip over one wall. Count skips that saved over 100 steps.
  - Part 2: Same as above, but now one are allowed to skip up to 20 walls once. Two skips count as equal if they start and stop at the same non-wall tile.
- Solution:
  - Part 1: Solve the map with A-star (unecessary, but copied from day 18). Loop over maze and if it is a wall, remove it, solve with the new map and check if it is at least 100 steps faster than without the skip.
  - Part 2: First get the distances from the start in the map without cheats. Then loop over every combination of coordinates, and if they both are not a wall, and if the difference between the latter and the first minus manhattan distance is greater than 100, count the shortcut.

**Day 21:**

- Task: Move robots with pads.
  - Part 1: Given a code and a keypad, provide instructions on how to navigate the keypad with a different keypad. Repeat twice.
  - Part 2: Given a code and a keypad, provide instructions on how to navigate the keypad with a different keypad. Repeat twenty five times.
- Solution:
  - Part 1: Make the keypads as arrays. Make a function that finds the indexes given the symbol. Then, calculate the distances in y and x directions, and add moves accordingly. Make a special rule for avoiding the empty spaces. The fastest paths turned out to be non-trivial, so for every time there is a choice (both vertical and horizontal movement), do the vertical movements first with a 50% chance. Then, compute everything 100 times and choose the shortest path. Very hacky solution, but it worked.
  - Part 2: I needed a lot of help from the subreddit on this one. Switch to python, so I can easily cache recursive calls with `@cahce`. Instead of calculating the path for a whole sequence at a time, only do one step, and end with an "A". Somehow the random part of the program still worked, and I am not sure why. I am not entierly convinced that I understand the recursion happening here.
- Used help: Yes, a lot (part 2).

**Day 22:**

- Task: Calculate moneky banana prices
  - Part 1: Given some steps of calculating the next number in the sequence, calculate 2000th number in sequence, for each initial number.
  - Part 2: The price is given by the last digit in the sequence from part 1. Find the single best sequence of four price *changes* that gives the highest price for all sequences. A price is given by the four price changes before it, if it is found in the sequence.
- Solution:
  - Part 1: Pretty straight forward calculation of the next number, then iterate 2000 times for each input and sum the last numbers.
  - Part 2: Super brute-force! For each sequence of price changes, loop over all the price sequences and calculate the total price. Took 5-10 minutes with a very non-optimized code.
- Possible efficiency improvements: In part 2, a slightly less brute force approach would be to only loop over price change sequence that actually appear in each sequence of prices changes, and then store sequence: price pairs in a global map.
- Used help: No.
- Brute-force: Yes, very.

**Day 23:**

- Task: LAN connections.
  - Part 1: Find every three-clique of computers in networks, and return the amount that has at least one computer starting with "t".
  - Part 2: Find the largest n-clique in the graph.
- Solution:
  - Part 1: Find three cliques by checking if every connected node had a common node connection.
  - Part 2: Generalize the function from part 1 to make a list of k-cliques given a list of k-1-cliques. For every pair of k-1-cliques, checks if there are exactly one node from each that is not in the other. If so, check if those two nodes has a connection. If yes, merge them and add as a k-clique. Runs extremely slow.
- Used help: No.
- Efficient solution: No.
- Brute force: Yes, extremely. Took about 30 minutes to run. Must be brute forced in some way (NP-complete problem), but the solution can still be improved by a lot.

**Day 24:**

- Task:
  - Part 1:
  - Part 2:
- Solution:
  - Part 1:
  - Part 2:

**Day 25:**

- Task:
  - Part 1:
  - Part 2:
- Solution:
  - Part 1:
  - Part 2:
