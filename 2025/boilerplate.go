package main

import "errors"

func Boilerplate(filename, task string) error {
	if task != "a" && task != "b" {
		println("Argument `task` must be either `a` or `b`. Was: ", task)
		return errors.New("invalid argument")
	}

	_, err := ReadInput(filename, "\n")
	if err != nil {
		panic(err)
	}
	switch task {
	case "a":
	case "b":
	}

	return nil
}
