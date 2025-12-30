package main

import (
	"errors"
	"strings"
)

func processData11(lines []string) map[string][]string {
	nodes := make(map[string][]string)
	for _, line := range lines {
		parts := strings.Split(line, " ")
		name := strings.Trim(parts[0], ":")
		nodes[name] = parts[1:]
	}
	return nodes
}

func findPathRec(nodes map[string][]string, current string) int {
	if current == "out" {
		return 1
	}
	neighbours, ok := nodes[current]
	if !ok {
		// Reached dead end, node with no neighbours
		return 0
	}
	count := 0
	for _, neighbour := range neighbours {
		count += findPathRec(nodes, neighbour)
	}
	return count
}

func findAllPaths(nodes map[string][]string) int {
	return findPathRec(nodes, "you")
}

type State struct {
	current    string
	dacVisited bool
	fftVisted  bool
}

func findPathRecB(nodes map[string][]string, state State, memoization map[State]int) int {
	if value, ok := memoization[state]; ok {
		return value
	}

	current := state.current
	dacVisited := state.dacVisited
	fftVisited := state.fftVisted

	if current == "out" {
		if dacVisited && fftVisited {
			return 1
		}
		return 0
	}
	if current == "dac" {
		dacVisited = true
	}
	if current == "fft" {
		fftVisited = true
	}
	neighbours, ok := nodes[current]
	if !ok {
		// Reached dead end, node with no neighbours
		return 0
	}
	count := 0
	for _, neighbour := range neighbours {
		newState := State{neighbour, dacVisited, fftVisited}
		count += findPathRecB(nodes, newState, memoization)
	}
	memoization[state] = count
	return count
}

func findAllPathsB(nodes map[string][]string) int {
	state := State{"svr", false, false}
	return findPathRecB(nodes, state, make(map[State]int, 0))
}

func Task11(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}

	nodes := processData11(lines)
	result := 0

	switch task {
	case "a":
		result = findAllPaths(nodes)
	case "b":
		result = findAllPathsB(nodes)
	}

	println(result)
	return nil
}
