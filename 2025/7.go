package main

import "errors"

func getStart(data [][]byte) (int, int) {
	for i, character := range data[0] {
		if character == 'S' {
			return 0, i
		}
	}
	return -1, -1
}

func calculateSplits(data [][]byte) int {
	startRow, startCol := getStart(data)
	nSplits := 0
	nSplits2 := 0

	var moveBeam func(row, col int)
	moveBeam = func(row, col int) {
		if row == len(data)-1 { // Reached bottom
			return
		}
		// Do not need to care about going to the lef or right sides of
		// the grid, given the dimensions of the input
		if data[row+1][col] == '.' {
			data[row+1][col] = '|'
			moveBeam(row+1, col)
		}
		if data[row+1][col] == '^' {
			nSplits++
			split := 0
			// Walk left
			if data[row+1][col-1] == '.' {
				data[row+1][col-1] = '|'
				split = 1
				moveBeam(row+1, col-1)
			}
			// Walk right
			if data[row+1][col+1] == '.' {
				data[row+1][col+1] = '|'
				split = 1
				moveBeam(row+1, col+1)
			}
			nSplits2 += split
		}
	}

	moveBeam(startRow, startCol)
	return nSplits
}

type Coordinate struct {
	Row int
	Col int
}

func calculatePaths(data [][]byte) int {
	startRow, startCol := getStart(data)
	memoization := make(map[Coordinate]int)

	var moveBeam func(row, col int) int
	moveBeam = func(row, col int) int {
		if row == len(data)-1 { // Reached bottom
			return 1
		}
		// Do not need to care about going to the lef or right sides of
		// the grid, given the dimensions of the input

		// Check if in cache
		value, ok := memoization[Coordinate{row, col}]
		if ok {
			return value
		}

		if data[row+1][col] == '.' {
			value = moveBeam(row+1, col)
		}
		if data[row+1][col] == '^' {
			value = moveBeam(row+1, col-1) + moveBeam(row+1, col+1)
		}
		memoization[Coordinate{row, col}] = value // Store new cache
		return value
	}

	nPaths := moveBeam(startRow, startCol)
	return nPaths
}

func Task7(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}

	data := processGridData(lines)
	nThings := 0

	switch task {
	case "a":
		nThings = calculateSplits(data)
	case "b":
		nThings = calculatePaths(data)
	}

	println(nThings)
	return nil
}
