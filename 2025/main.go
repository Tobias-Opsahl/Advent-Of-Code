package main

func main() {
	err := Task1a("1_input.txt")
	err = Task1b("1_input.txt")
	err = Task2("2_input.txt", "a")
	err = Task2("2_input.txt", "b")
	err = Task3("3_input.txt", "a")
	err = Task3("3_input.txt", "b")
	err = Task4("4_input.txt", "a")
	err = Task4("4_input.txt", "b")
	err = Task5("5_input.txt", "a")
	err = Task5("5_input.txt", "b")
	err = Task6("6_input.txt", "a")
	err = Task6("6_input.txt", "b")
	err = Task9("9_input.txt", "a")
	err = Task7("7_input.txt", "b")
	err = Task7("7_input.txt", "a")
	err = Task8("8_input.txt", "b")
	err = Task8("8_input.txt", "a")
	err = Task9("9_input.txt", "a")
	err = Task9("9_input.txt", "b")
	err = Task10("10_input.txt", "a")
	err = Task10("10_input.txt", "b")
	err = Task11("11_input.txt", "a")
	err = Task11("11_input.txt", "b")
	err = Task12("12_input.txt", "a")

	if err != nil {
		panic(err)
	}
}
