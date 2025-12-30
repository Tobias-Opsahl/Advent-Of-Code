package main

import (
	"errors"
	"strconv"
	"strings"
)

func getRedTiles(lines []string) ([][]int, error) {
	redTiles := make([][]int, len(lines))
	for i, line := range lines {
		numbers := strings.Split(line, ",")
		x, err := strconv.Atoi(numbers[0])
		if err != nil {
			return nil, err
		}
		y, err := strconv.Atoi(numbers[1])
		if err != nil {
			return nil, err
		}
		redTiles[i] = []int{x, y}
	}
	return redTiles, nil
}

func absDiff(x, y int) int {
	if x >= y {
		return x - y
	}
	return y - x
}

func calculateArea(tile1, tile2 []int) int {
	height := absDiff(tile1[0], tile2[0]) + 1
	length := absDiff(tile1[1], tile2[1]) + 1
	return height * length
}

func findMaxAreaA(redTiles [][]int) int {
	maxArea := 0
	for i := range redTiles {
		for j := i + 1; j < len(redTiles); j++ {
			area := calculateArea(redTiles[i], redTiles[j])
			if area > maxArea {
				maxArea = area
			}
		}
	}
	return maxArea
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func edgeCrossesInterior(redTile1, redTile2 []int, rx1, ry1, rx2, ry2 int) bool {
	// Checks if a polygon edge, marked by two red tiles, overlaps with a rectangle.
	px1 := min(redTile1[0], redTile2[0])
	px2 := max(redTile1[0], redTile2[0])
	py1 := min(redTile1[1], redTile2[1])
	py2 := max(redTile1[1], redTile2[1])

	return px1 < rx2 && px2 > rx1 && py1 < ry2 && py2 > ry1
}

func checkValid(i, j int, redTiles [][]int) bool {
	p1 := redTiles[i]
	p2 := redTiles[j]

	rx1 := min(p1[0], p2[0])
	rx2 := max(p1[0], p2[0])
	ry1 := min(p1[1], p2[1])
	ry2 := max(p1[1], p2[1])

	n := len(redTiles)
	for k := range n {
		redTile1 := redTiles[k]
		redTile2 := redTiles[(k+1)%n]
		if edgeCrossesInterior(redTile1, redTile2, rx1, ry1, rx2, ry2) {
			return false
		}
	}

	return true
}

func findMaxAreaB(redTiles [][]int) int {
	maxArea := 0
	for i := range redTiles {
		for j := i + 1; j < len(redTiles); j++ {
			if !checkValid(i, j, redTiles) {
				continue
			}
			area := calculateArea(redTiles[i], redTiles[j])
			if area > maxArea {
				maxArea = area
			}
		}
	}
	return maxArea
}

func Task9(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}
	redTiles, err := getRedTiles(lines)
	if err != nil {
		return err
	}
	result := 0

	switch task {
	case "a":
		result = findMaxAreaA(redTiles)
	case "b":
		result = findMaxAreaB(redTiles)
	}

	println(result)
	return nil
}
