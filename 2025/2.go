package main

import (
	"errors"
	"strconv"
	"strings"
)

func checkInvalidA(number int) bool {
	sequence := strconv.Itoa(number)
	middle := len(sequence) / 2
	lower := sequence[:middle]
	upper := sequence[middle:]
	return lower == upper
}

func checkInvalidB(number int) bool {
	sequence := strconv.Itoa(number)
	length := len(sequence)
	// Try to split id in all possible lengths
	for nIntervals := 2; nIntervals <= length; nIntervals++ {
		if length%nIntervals != 0 {
			// The splits does not add up in the id
			continue
		}
		// Interval length
		interval := length / nIntervals
		// Add all of the splits corresponding to the intervals in an array
		subIds := make([]string, nIntervals)
		for j := 0; j < nIntervals; j++ {
			subIds[j] = sequence[j*interval : (j+1)*interval]
		}
		// Check if all the sub arrays are equal
		allEqual := true
		for _, subId := range subIds {
			if subIds[0] != subId {
				allEqual = false
				break
			}
		}
		if allEqual {
			return true
		}
	}
	return false
}

func Task2(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}
	data, err := ReadInput(filename, ",")
	if err != nil {
		return err
	}
	sum := 0

	var intervalSplit []string
	for _, interval := range data {
		intervalSplit = strings.Split(interval, "-")
		if len(intervalSplit) != 2 {
			return nil
		}
		lower, err := strconv.Atoi(intervalSplit[0])
		if err != nil {
			return err
		}
		upper, err := strconv.Atoi(intervalSplit[1])
		if err != nil {
			return err
		}

		for i := lower; i <= upper; i++ {
			switch task {
			case "a":
				if checkInvalidA(i) {
					sum += i
				}
			case "b":
				if checkInvalidB(i) {
					sum += i
				}
			}
		}
	}
	println(sum)
	return nil
}
