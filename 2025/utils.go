package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const INPUT_FOLDER = "inputs"

func ReadInput(filename, splitOn string) ([]string, error) {
	path := filepath.Join(INPUT_FOLDER, filename)

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	text := string(data)
	lines := strings.Split(text, splitOn)

	// Remove optional empty line at the end
	if len(lines) > 0 && lines[len(lines)-1] == "" {
		lines = lines[:len(lines)-1]
	}
	return lines, nil
}

func PrintArray(data [][]byte) {
	nRows := len(data)
	if nRows == 0 {
		println("[]")
		return
	}
	nCols := len(data[0])
	if nCols == 0 {
		println("[]")
		return
	}
	for i := range nRows {
		for j := range nCols {
			fmt.Printf("%c", data[i][j])
		}
		println()
	}
}

func processGridData(lines []string) [][]byte {
	if len(lines) == 0 {
		return [][]byte{}
	}
	nRows := len(lines)
	nCols := len(lines[0])
	data := make([][]byte, nRows)

	for i, line := range lines {
		data[i] = make([]byte, nCols)
		for j := range nCols {
			character := line[j]
			data[i][j] = character
		}
	}
	return data
}
