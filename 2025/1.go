package main

import "strconv"

func Task1a(filename string) error {
	lines, err := ReadInput(filename, "\n")
	if err != nil {
		return err
	}

	position := 50
	zeroCount := 0

	// var direction ch
	var amount int
	for _, line := range lines {
		direction := line[0]
		amount, err = strconv.Atoi(line[1:])
		if err != nil {
			return err
		}

		if direction == 'L' {
			position -= amount
		} else {
			position += amount
		}
		position = (position + 100) % 100
		if position == 0 {
			zeroCount += 1
		}
	}
	println(zeroCount)
	return nil
}

func Task1b(filename string) error {
	lines, err := ReadInput(filename, "\n")
	if err != nil {
		return err
	}

	position := 50
	zeroCount := 0

	// var direction ch
	var amount int
	var newPosition int

	for _, line := range lines {
		direction := line[0]
		amount, err = strconv.Atoi(line[1:])
		if err != nil {
			return err
		}

		if direction == 'L' {
			newPosition = position - amount
		} else {
			newPosition = position + amount
		}
		newPosition = ((newPosition % 100) + 100) % 100

		zeroCount += amount / 100

		if direction == 'L' && position != 0 && newPosition > position {
			zeroCount += 1
		} else if direction == 'R' && position != 0 && newPosition < position {
			zeroCount += 1
		} else if newPosition == 0 {
			zeroCount += 1
		}
		position = newPosition

	}
	println(zeroCount)
	return nil
}
