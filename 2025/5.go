package main

import (
	"errors"
	"strconv"
	"strings"
)

func processData5(lines []string) ([][2]int, []int, error) {
	var ranges [][2]int
	var ingredients []int

	blankLine := false
	for _, line := range lines {
		if line == "" {
			blankLine = true
			continue
		}
		if blankLine {
			ingredient, err := strconv.Atoi(line)
			if err != nil {
				return nil, nil, err
			}
			ingredients = append(ingredients, ingredient)
			continue
		}
		// We have a range
		rangeString := strings.Split(line, "-")
		start, err := strconv.Atoi(rangeString[0])
		if err != nil {
			return nil, nil, err
		}
		end, err := strconv.Atoi(rangeString[1])
		if err != nil {
			return nil, nil, err
		}
		var rangeInt [2]int = [2]int{start, end}
		ranges = append(ranges, rangeInt)
	}
	return ranges, ingredients, nil
}

func calculateInterval(lower, upper, startIdx, endIdx int, ranges [][2]int) int {
	for i := startIdx; i < endIdx; i++ {
		// If interval is every not valid, return 0, all the indicies have been repeated
		if upper < lower {
			return 0
		}
		compareRange := ranges[i]
		cLower := compareRange[0]
		cUpper := compareRange[1]
		// Compare range is contained in current interval (lower, upper).
		// Split into two intervals and continue iterating from i+1
		if lower <= cLower && upper >= cUpper {
			lowerIntervalCount := calculateInterval(lower, cLower-1, i+1, endIdx, ranges)
			upperIntervalCount := calculateInterval(cUpper+1, upper, i+1, endIdx, ranges)
			return lowerIntervalCount + upperIntervalCount
		}
		// Partial overlap, adjust interval up or down.
		if lower >= cLower && lower <= cUpper {
			lower = cUpper + 1
		}
		if upper >= cLower && upper <= cUpper {
			upper = cLower - 1
		}
	}
	return max(0, upper-lower+1)
}

func Task5(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}

	ranges, ingredients, err := processData5(lines)
	if err != nil {
		return err
	}

	nFreshIngredients := 0
	switch task {
	case "a":
		for _, ingredient := range ingredients {
			for _, ingredientRange := range ranges {
				if ingredient >= ingredientRange[0] && ingredient <= ingredientRange[1] {
					nFreshIngredients += 1
					break
				}
			}
		}
	case "b":
		for i, ingredientRange := range ranges {
			lower := ingredientRange[0]
			upper := ingredientRange[1]
			nFreshIngredients += calculateInterval(lower, upper, 0, i, ranges)
		}
	}
	println(nFreshIngredients)
	return nil
}
