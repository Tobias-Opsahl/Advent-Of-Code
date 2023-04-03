#include <iostream>
#include <fstream>
#include <string>

int* read_file(std::string filename) {
    // Reads line in file and returns a pointer to the array
    int number_of_lines = 0;
    std::ifstream myfile(filename);
    std::string line;
    while (std::getline(myfile, line)) {
        number_of_lines++;
    }
    const int max_size = 100000;
    int numbers[max_size];
    myfile.close();

    myfile.open(filename);
    if (myfile.is_open()) { // always check whether the file is open
        for (int i = 0; i < number_of_lines; i++) {
            std::getline(myfile, line);
            numbers[i] = std::stoi(line);
        }
        myfile.close();
    }
    int* array_pointer = numbers;
    return array_pointer;
}

void print_array(int print_array[], int size) {
    for (int i = 0; i < size; i++) {
        std::cout << print_array[i] << "\n";
    }
}

int main() {
    // Counter number of lines in input file using ifstream
    std::string filename = "inputs/01_input.txt";
    // int* array_pointer = read_file(filename);
    int number_of_lines = 0;
    std::ifstream myfile(filename);
    std::string line;
    while (std::getline(myfile, line)) {
        number_of_lines++;
    }
    const int max_size = 100000;
    int numbers[max_size];
    myfile.close();

    myfile.open(filename);
    if (myfile.is_open()) { // always check whether the file is open
        for (int i = 0; i < number_of_lines; i++) {
            std::getline(myfile, line);
            numbers[i] = std::stoi(line);
        }
        myfile.close();
    }

    // Begin the task
    int n_increases = 0;  // Increases we should count
    int current;  // Current depth
    int next;  // Next depth
    for (int i = 0; i < number_of_lines - 1; i++) {
        current = numbers[i];
        next = numbers[i + 1];
        if (next > current) {
            n_increases++;
        }
    }
    std::cout << n_increases;
    // print_array(numbers, number_of_lines);
    return 0;
}
