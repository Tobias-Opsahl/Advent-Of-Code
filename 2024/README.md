# 2024

This year's excersises will be mostly solved in Javascript and node.js, in order to learn the langauge. There are some repeated boilerplate code for reading and processing the input found in `boilerplate.js`. This could be used as a module for less copying.

Day 17:
    Task:
        Part 1: Simulate simple 3 bit Turing machine.
        Part 2: Find input A to Turing machine so that the output matches its input.
    Solution:
        Part 1: Simple implemenation of the Turing machine.
        Part 2: I could not do this one by myself, and had to read up to understand the logic. After analysing the program, one can find out that the A modulo 8 gets outputed, and 8 gets divided by 8. The other inputs are irrelevant. Recursivly find which number in (0, 7) that produces the correct last digit of instructions. Multiply number by 8 and find number in (0, 7) that outputs second to last digit of instructions, and so on.

Day 18:
    Task:
        Part 1: Find length of shortest path in 2d grid labyrinth.
        Part 2: Find wall number that makes the labyrinth unsolvable.
    Solution:
        Part 1: BFS search. Also A-star with various heuristics, but since the start was a the upper left, and end was at the lower right, every move from the beginning went in the direction of the end, so a-star was not an improvement of BFS. I did this to repeat some algorithms I had not implemented in a little while.
        Part 2: Iteratively add walls and check if BFS found a solution. Implement both with brute-force (add one and one) and binary search.
    Efficient and elegant implementation: Yes.

Day 19:
    Task:
        Part 1: Given an array of string `towels`, count the amount of patterns in `patterns` (also strings) that can be created by combining strings in `towels`.
        Part 2: Count the amount of unique possible ways of making the strings in `patterns` with the strings from `towels`.
    Solution:
        Part 1: Recursive search. Loop over `towels`, try to match it with the current pattern. If it works, remove the first part of the pattern corresponding to the towel and call the function recursivly.
        Part 2: Recursive search with memoization. Do the same as in task 1, but instead of aborting the search when a pattern is made, increment counter and continue searching for other ways. In order to make the complexity linear and not exponential, dd memoization. When a subpattern is searched, add it and the amount of times it was matched to an object. When starting a search, first check if the subpattern is in that object and return the amount of times it was found if yes.
    Efficient and elegant implementation: Yes.
