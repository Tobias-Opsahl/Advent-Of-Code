package main

import (
	"errors"
	"strconv"
	"strings"
)

func processData6a(lines []string) ([][]int, []byte, error) {
	nLines := len(lines)
	nTasks := len(strings.Fields(lines[0]))

	tasks := make([][]int, nTasks)
	for i := range nTasks {
		tasks[i] = make([]int, nLines-1)
	}
	operators := make([]byte, nTasks)

	for i, line := range lines {
		if i == nLines-1 {
			characters := strings.Fields(line)
			for j := range characters {
				operators[j] = characters[j][0]
			}
			break
		}
		numbers := strings.Fields(line)
		for j, number := range numbers {
			numberInt, err := strconv.Atoi(number)
			tasks[j][i] = numberInt
			if err != nil {
				return nil, nil, err
			}
		}
	}
	return tasks, operators, nil
}

func processData6b(lines []string) ([][]int, []byte, error) {
	nLines := len(lines)
	nTasks := len(strings.Fields(lines[0]))

	tasks := make([][]string, nTasks)
	for i := range nTasks {
		tasks[i] = make([]string, nLines-1)
	}
	operators := make([]byte, nTasks)
	// How many spaces after each operator. Equal to the amount of numbers in each task.
	spaceCounts := make([]int, nTasks)

	lastLine := lines[nLines-1]
	spaceCount := 0 // How many spaces / numbers in current task
	indexCount := 0 // Which task we are on.
	for i, character := range lastLine {
		if i == 0 {
			operators[i] = byte(character)
			continue
		}
		switch character {
		case '+', '*':
			operators[indexCount+1] = byte(character)
			spaceCounts[indexCount] = spaceCount
			indexCount += 1
			spaceCount = 0
		case ' ':
			spaceCount += 1
		}
	}
	// Last line. Add 1 for the missing separator column
	spaceCounts[indexCount] = spaceCount + 1

	for i, line := range lines {
		if i == nLines-1 { // Reached operator row
			break
		}
		indexCount := 0
		characterCount := 0
		for _, character := range line {
			if indexCount == nTasks { // If there are trailing spaces in last task
				break
			}
			if characterCount == spaceCounts[indexCount] {
				indexCount += 1
				characterCount = 0
				continue
			}
			if character == ' ' {
				characterCount += 1
				continue
			}
			// Concatenate next character in number
			updatedNumber := tasks[indexCount][characterCount] + string(character)
			tasks[indexCount][characterCount] = updatedNumber
			characterCount += 1
		}
	}

	// Convert from string to int
	tasksInt := make([][]int, nTasks)
	for i := range tasks {
		tasksInt[i] = make([]int, spaceCounts[i])
		for j := range spaceCounts[i] {
			number, err := strconv.Atoi(tasks[i][j])
			if err != nil {
				return nil, nil, err
			}
			tasksInt[i][j] = number
		}
	}

	return tasksInt, operators, nil
}

func reduceTask(task []int, operator byte) int {
	answer := task[0]

	for i := 1; i < len(task); i++ {
		switch operator {
		case '+':
			answer += task[i]
		case '*':
			answer *= task[i]
		}
	}

	return answer
}

func Task6(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	lines, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}

	totalAnswer := 0
	var tasks [][]int
	var operators []byte
	switch task {
	case "a":
		tasks, operators, err = processData6a(lines)
		if err != nil {
			return err
		}
	case "b":
		tasks, operators, err = processData6b(lines)
		if err != nil {
			return err
		}
	}
	for i, task := range tasks {
		answer := reduceTask(task, operators[i])
		totalAnswer += answer
	}
	println(totalAnswer)
	return nil
}
