package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

func togglePosition(position int) int {
	if position == 0 {
		return 1
	}
	return 0
}

func applyButton(state, button []int) []int {
	for _, index := range button {
		state[index] = togglePosition(state[index])
	}
	return state
}

func checkIfCorrect(goalState []int, buttonIndices []int, buttonSet [][]int) bool {
	// Apply button clicks and check if the goal is reached
	newState := make([]int, len(goalState))
	for _, index := range buttonIndices {
		newState = applyButton(newState, buttonSet[index])
	}
	for i, position := range newState {
		if position != goalState[i] {
			return false
		}
	}
	return true
}

type ButtonState struct {
	subset []int // Indices of button clicks
	next   int   // Smallest number that can be added, to avoid duplicate subsets
}

func findMinimalClicks(goalState []int, buttonSet [][]int) int {
	// Breadth first search over powerset of the buttons
	queue := []ButtonState{{nil, 0}}

	for len(queue) > 0 {
		buttonState := queue[0]
		queue = queue[1:]

		if checkIfCorrect(goalState, buttonState.subset, buttonSet) {
			return len(buttonState.subset)
		}

		for i := buttonState.next; i < len(buttonSet); i++ {
			// Be sure to copy the subset
			nextSet := append(append([]int(nil), buttonState.subset...), i)
			queue = append(queue, ButtonState{nextSet, i + 1})
		}
	}

	return -10
}

func findMinimalClicksTotal(initialStates [][]int, buttonSets [][][]int) int {
	counter := 0
	for i := range len(initialStates) {
		count := findMinimalClicks(initialStates[i], buttonSets[i])
		counter += count
	}
	return counter
}

func checkJoltageConfiguration(joltages []int, state []int) int {
	for i, joltage := range state {
		if joltage > joltages[i] {
			// Too high joltage, no way to recover
			return -1
		}
	}
	for i, joltage := range state {
		if joltage < joltages[i] {
			// Too low joltage, not there yet
			return 0
		}
	}
	return 1 // Found goal
}

type JoltageState struct {
	joltages []int
	depth    int
}

func encodeJoltageState(joltageState []int) string {
	// Encode joltage to string so that it can be easily cached and compared
	encoded := make([]byte, 0, 2*len(joltageState))
	for _, joltage := range joltageState {
		encoded = append(encoded, byte(joltage), ',')
	}
	return string(encoded)
}

func findMinimalJoltages(buttonSet [][]int, joltages []int) int {
	queue := []JoltageState{{make([]int, len(joltages)), 0}}
	visited := make(map[string]int)

	for len(queue) > 0 {
		// println(len(queue))
		joltageState := queue[0]
		queue = queue[1:]

		encoded := encodeJoltageState(joltageState.joltages)
		if depth, ok := visited[encoded]; ok && depth <= joltageState.depth {
			// Visited before with similar or lower depth, prune search
			continue
		}
		visited[encoded] = joltageState.depth

		status := checkJoltageConfiguration(joltages, joltageState.joltages)
		if status == -1 {
			continue
		}
		if status == 1 {
			println("!!!")
			return joltageState.depth
		}
		for i := range buttonSet {
			// Be sure to copy the subset
			next := append([]int(nil), joltageState.joltages...)
			for _, button := range buttonSet[i] {
				next[button] += 1
			}
			queue = append(queue, JoltageState{next, joltageState.depth + 1})
		}
	}

	return -10
}

func findMinimalJoltagesTotal(buttonSets [][][]int, joltagesFull [][]int) int {
	counter := 0
	for i := range len(buttonSets) {
		fmt.Printf("[%d / %d]", i, len(buttonSets))
		count := findMinimalJoltages(buttonSets[i], joltagesFull[i])
		counter += count
	}
	return counter
}

func processData(lines []string) ([][]int, [][][]int, [][]int) {
	goalStates := make([][]int, len(lines))
	buttons := make([][][]int, len(lines))
	joltages := make([][]int, len(lines))

	for i, line := range lines {
		components := strings.Split(line, " ")

		// Initial state
		goalStateString := components[0]
		goalState := make([]int, len(goalStateString)-2)
		for j, status := range goalStateString[1 : len(goalStateString)-1] {
			if status == '.' {
				goalState[j] = 0
			} else {
				goalState[j] = 1
			}
		}
		goalStates[i] = goalState

		// Buttons
		buttonStrings := components[1 : len(components)-1]
		buttonSets := make([][]int, len(buttonStrings))
		for j, buttonString := range buttonStrings {
			buttonString = strings.Trim(buttonString, "()")
			effects := strings.Split(buttonString, ",")
			buttonSet := make([]int, len(effects))
			for k, effect := range effects {
				effect, err := strconv.Atoi(effect)
				if err != nil {
					panic(err)
				}
				buttonSet[k] = effect
			}
			buttonSets[j] = buttonSet
		}
		buttons[i] = buttonSets

		// Joltages
		joltageString := components[len(components)-1]
		joltageString = strings.Trim(joltageString, "{}")
		parts := strings.Split(joltageString, ",")
		joltage := make([]int, len(parts))
		for j, number := range parts {
			number, err := strconv.Atoi(number)
			if err != nil {
				panic(err)
			}
			joltage[j] = number
		}
		joltages[i] = joltage

	}
	return goalStates, buttons, joltages
}

func findMinimalClicksAll(goalState []int, buttonSet [][]int) [][]int {
	// Find all of the possibilities for minimum clicks, not just the smallets
	possibilities := make([][]int, 0)
	// Breadth first search over powerset of the buttons
	queue := []ButtonState{{nil, 0}}

	for len(queue) > 0 {
		buttonState := queue[0]
		queue = queue[1:]

		if checkIfCorrect(goalState, buttonState.subset, buttonSet) {
			possibilities = append(possibilities, buttonState.subset)
		}

		for i := buttonState.next; i < len(buttonSet); i++ {
			// Be sure to copy the subset
			nextSet := append(append([]int(nil), buttonState.subset...), i)
			queue = append(queue, ButtonState{nextSet, i + 1})
		}
	}

	return possibilities
}

func findJoltagesRec(buttonSet [][]int, joltages []int, visited map[string]int) int {
	// Implementation of really cool recursive solution from (I did not want to just do linear algebra)
	// https://www.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
	// Check memoization
	encoded := encodeJoltageState(joltages)
	if stepsVisited, ok := visited[encoded]; ok {
		return stepsVisited
	}
	// Check base case, if we have found 0, 0, 0, ... joltage state.
	finished := true
	for _, joltage := range joltages {
		if joltage != 0 {
			finished = false
			break
		}
	}
	if finished {
		return 0
	}

	tempGoalState := make([]int, len(joltages))
	for i, joltage := range joltages {
		if joltage%2 == 1 {
			tempGoalState[i] = 1
		}
	}

	solutions := findMinimalClicksAll(tempGoalState, buttonSet)

	minCount := 10000000
	for _, solution := range solutions {
		newJoltages := append([]int(nil), joltages...)
		for _, buttonIndex := range solution {
			for _, part := range buttonSet[buttonIndex] {
				newJoltages[part] -= 1
			}
		}
		negative := false
		for i := range newJoltages {
			if newJoltages[i]%2 != 0 {
				println("??")
				return -1000
			}
			if newJoltages[i] < 0 {
				negative = true
				break
			}
			newJoltages[i] = newJoltages[i] / 2
		}
		if negative {
			continue
		}
		count := 2*findJoltagesRec(buttonSet, newJoltages, visited) + len(solution)
		if count < minCount {
			minCount = count
		}
	}

	visited[encoded] = minCount
	return minCount
}

func findJoltagesAll(buttonSets [][][]int, joltagesAll [][]int) int {
	counter := 0
	for i := range buttonSets {
		count := findJoltagesRec(buttonSets[i], joltagesAll[i], make(map[string]int))
		counter += count
	}
	return counter
}

func Task10(filename, task string) error {
	if task != "a" && task != "b" && task != "b2" {
		println("Argument `task` must be either `a`, `b` or `b2`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}
	result := 0

	switch task {
	case "a":
		goalStates, buttons, _ := processData(lines)
		result = findMinimalClicksTotal(goalStates, buttons)
	case "b":
		_, buttons, joltages := processData(lines)
		result = findJoltagesAll(buttons, joltages)
	case "b2":
		// Breadth first with memoization, does not work fast enough
		_, buttons, joltages := processData(lines)
		result = findMinimalJoltagesTotal(buttons, joltages)
	}

	println(result)
	return nil
}
