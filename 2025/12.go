package main

import (
	"errors"
	"strconv"
	"strings"
)

func processData12(lines []string) ([][]int, [][]int) {
	allSizes := make([][]int, 0)
	allPieces := make([][]int, 0)

	for _, line := range lines {
		if len(line) <= 4 || line[2] != 'x' {
			continue
		}
		parts := strings.Split(line, " ")
		sizes := strings.Split(strings.Trim(parts[0], ":"), "x")
		height, err := strconv.Atoi(sizes[0])
		if err != nil {
			panic(err)
		}
		width, err := strconv.Atoi(sizes[1])
		if err != nil {
			panic(err)
		}
		allSizes = append(allSizes, []int{height, width})

		pieces := make([]int, len(parts[1:]))
		for j, nPieces := range parts[1:] {
			pieces[j], err = strconv.Atoi(nPieces)
			if err != nil {
				panic(err)
			}
		}
		allPieces = append(allPieces, pieces)
	}
	return allSizes, allPieces
}

func checkIfPresentsFits(size, pieces []int) bool {
	nPresents := 0
	for _, nSinglePiece := range pieces {
		nPresents += nSinglePiece
	}
	nFields := size[0] / 3 * size[1] / 3

	return nPresents <= nFields
}

func checkAllFields(sizes, pieces [][]int) int {
	count := 0
	for i := range sizes {
		if checkIfPresentsFits(sizes[i], pieces[i]) {
			count += 1
		}
	}
	return count
}

func Task12(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")

	sizes, pieces := processData12(lines)

	if err != nil {
		panic(err)
	}

	result := 0

	switch task {
	case "a":
		// for i := range sizes {
		// 	for j := range sizes[i] {
		// 		print(sizes[i][j], " ")
		// 	}
		// 	println()
		// }
		// for i := range pieces {
		// 	for j := range pieces[i] {
		// 		print(pieces[i][j], " ")
		// 	}
		// 	println()
		// }
		result = checkAllFields(sizes, pieces)
	case "b":
	}

	println(result)

	return nil
}
