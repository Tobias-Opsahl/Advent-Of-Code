#include <iostream>
#include <fstream>
#include <string>

void print_array(int print_array[], int size) {
    // Prints all elements in the array
    for (int i = 0; i < size; i++) {
        std::cout << print_array[i] << "\n";
    }
}

int main() {
    // Counter number of lines in input file using ifstream
    std::string filename = "inputs/01_input.txt";
    int number_of_lines = 0;
    std::ifstream myfile(filename);
    std::string line;
    while (std::getline(myfile, line)) {
        number_of_lines++;
    }
    const int max_size = 100000;  // Max number of lines in file
    int numbers[max_size];
    myfile.close();

    // Add lines into array
    myfile.open(filename);
    if (myfile.is_open()) { // always check whether the file is open
        for (int i = 0; i < number_of_lines; i++) {
            std::getline(myfile, line);
            numbers[i] = std::stoi(line);
        }
        myfile.close();
    }

    // Make new array that contains the 3-sliding windows
    int sliding_numbers[max_size];  // Caclulate the sliding distances
    int k_slide = 3;  // The size to slide over
    int first_element = 0;  // Calculate value of first element
    for (int i = 0; i < k_slide; i++) {
        first_element = first_element + numbers[i];
    }
    int current = first_element;
    for (int i = 0; i < number_of_lines - k_slide + 1; i++) {
        sliding_numbers[i] = current;
        current = current - numbers[i];
        current = current + numbers[i + k_slide];
    }

    // Now that the new array is made, calculate like we did in task 1easy
    int n_increases = 0;  // Increases we should count
    current = 0;  // Current depth
    int next;  // Next depth
    for (int i = 0; i < number_of_lines - k_slide; i++) {
        current = sliding_numbers[i];
        next = sliding_numbers[i + 1];
        if (next > current) {
            n_increases++;
        }
    }
    std::cout << n_increases << "\n";
    return 0;
}
