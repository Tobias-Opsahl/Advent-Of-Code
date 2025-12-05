package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

func convertLineToInts(line string) []int {
	numbers := make([]int, len(line))
	for i := 0; i < len(line); i++ {
		numbers[i] = int(line[i] - '0')
	}
	return numbers
}

func findMaxSumA(numbers []int) (int, error) {
	maxFirst := 0
	maxSecond := 0

	for i, number := range numbers {
		// Only check second digit for end of input
		if i == len(numbers)-1 {
			if number > maxSecond {
				maxSecond = number
			}
			continue
		}
		if number > maxFirst {
			maxFirst = number
			maxSecond = 0
		} else if numbers[i] > maxSecond {
			maxSecond = number
		}
	}
	if maxFirst == 0 || maxSecond == 0 {
		return 0, fmt.Errorf("maxFirst %d or maxSecond %d was 0", maxFirst, maxSecond)
	}
	maxSum, _ := strconv.Atoi(strconv.Itoa(maxFirst) + strconv.Itoa(maxSecond))
	return maxSum, nil
}

func findMaxSumB(numbers []int) (int, error) {
	length := 12
	maxList := make([]int, length)

	for i, number := range numbers {
		for j := range maxList {
			if j < length-(len(numbers)-i) {
				continue
			}
			if number > maxList[j] {
				maxList[j] = number
				for k := j + 1; k < length; k++ {
					maxList[k] = 0
				}
				break
			}
		}
	}
	for i, digit := range maxList {
		if digit == 0 {
			return 0, fmt.Errorf("digit number %d was equal to 0", i)
		}
	}
	maxSumString := make([]string, length)
	for i, digit := range maxList {
		maxSumString[i] = strconv.Itoa(digit)
	}

	maxSum, _ := strconv.Atoi(strings.Join(maxSumString, ""))
	return maxSum, nil
}

func Task3(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}
	lines, err := ReadInput(filename, "\n")
	if err != nil {
		return err
	}

	totalSum := 0
	for _, line := range lines {
		numbers := convertLineToInts(line)
		var maxSum int
		switch task {
		case "a":
			maxSum, err = findMaxSumA(numbers)
		case "b":
			maxSum, err = findMaxSumB(numbers)
		}
		if err != nil {
			return err
		}
		// println(maxSum)
		totalSum += maxSum
	}

	println(totalSum)
	return nil
}
