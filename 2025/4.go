package main

import (
	"errors"
)

func addPadding(data [][]byte) [][]byte {
	nRows := len(data)
	if nRows == 0 {
		return [][]byte{}
	}
	nCols := len(data[0])
	if nCols == 0 {
		return [][]byte{}
	}

	newData := make([][]byte, nRows+2)
	for i := range nRows + 2 {
		newData[i] = make([]byte, nCols+2)
		for j := range nCols + 2 {
			if i == 0 || i == nRows+1 || j == 0 || j == nCols+1 {
				newData[i][j] = '.'
			} else {
				newData[i][j] = data[i-1][j-1]
			}
		}
	}

	return newData
}

func isAccessible(data [][]byte, row, column int) int {
	nAdjacent := 0
	for i := -1; i <= 1; i++ {
		for j := -1; j <= 1; j++ {
			// Do not count itself
			if i == 0 && j == 0 {
				continue
			}
			if data[row+i][column+j] == '@' {
				nAdjacent += 1
			}
		}
	}
	if nAdjacent < 4 {
		return 1
	}
	return 0
}

func Task4(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}
	lines, err := ReadInput(filename, "\n")
	if err != nil {
		return err
	}
	data := processGridData(lines)
	data = addPadding(data)

	nRows := len(data)
	if nRows == 0 {
		return nil
	}
	nCols := len(data[0])
	if nCols == 0 {
		return nil
	}

	nAccessable := 0
	switch task {
	case "a":
		for i := range nRows {
			for j := range nCols {
				if data[i][j] == '.' {
					continue
				}
				nAccessable += isAccessible(data, i, j)
			}
		}
	case "b":
		nIter := 0
		for {
			nIter += 1
			// newData represents the next iteration of the grid
			newData := make([][]byte, nRows)
			for i := range nRows {
				newData[i] = make([]byte, nCols)
				for j := range nCols {
					if data[i][j] == '.' {
						newData[i][j] = '.'
						continue
					}
					accessable := isAccessible(data, i, j)
					if accessable == 1 {
						newData[i][j] = '.'
					} else {
						newData[i][j] = '@'
					}
					nAccessable += accessable
				}
			}

			// Check if there is any change to the grid, break if not
			equal := true
			for i := range nRows {
				if !equal {
					break
				}
				for j := range nCols {
					if data[i][j] != newData[i][j] {
						equal = false
						break
					}
				}
			}
			if equal {
				break
			}
			data = newData
		}
		println(nIter)
	}
	println(nAccessable)
	return nil
}
