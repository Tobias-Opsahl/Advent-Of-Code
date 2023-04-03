#include <iostream>
#include <fstream>
#include <string>

void print_array(int my_array[][2], int size) {
    // Prints all elements in the (2d) array
    for (int i = 0; i < size; i++) {
        std::cout << my_array[i][0] << ", " << my_array[i][1] << "\n";
    }
}

int main() {
    // Count the number of lines in input file using ifstream
    std::string filename = "inputs/02_input.txt";
    int n_lines = 0;  // Number of lines in input
    std::ifstream myfile(filename);
    std::string line;
    while (std::getline(myfile, line)) {  // Loop over all the lines
        n_lines++;
    }
    myfile.close();

    const int n_cols = 2;  // We store one element for direction and one for length
    const int max_rows = 100000;  // Max number of lines in file
    int data[max_rows][n_cols];  // The data we will save the input in
    myfile.open(filename);
    std::string delimiter = " ";  // Where to split the lines in input
    int split_index;  // Where the delimiter appears in the line
    std::string instruction;  // The instructions of which direction to travel, first part of line
    int n_spaces;  // Amount of steps to take, second part of line
    if (myfile.is_open()) { // always check whether the file is open
        for (int i = 0; i < n_lines; i++) {  // Loop over all the lines in the file
            std::getline(myfile, line);  // Read line
            split_index = line.find(delimiter);
            instruction = line.substr(0, split_index);  // Argument before delimiter
            n_spaces = std::stoi(line.substr(split_index + 1, line.length()));  // Argument after delimiter
            if (instruction.compare("forward") == 0) {  // We save forward as "0"
                data[i][0] = 0;
            } else if (instruction.compare("down") == 0) {  // down as "1"
                data[i][0] = 1;
            } else if (instruction.compare("up") == 0) {  // and up as "2"
                data[i][0] = 2;
            }
            data[i][1] = n_spaces;
        }
        myfile.close();
    }
    // print_array(data, n_lines);
    // Begin task

    int pos = 0;  // Horizontal position, controlled by forward
    int depth = 0;  // Controlled by up and down
    int aim = 0;  // Aim, introduced in 2-hard.
    for (int i = 0; i < n_lines; i++) { // Loop over all the rows in data
        if (data[i][0] == 0) {  // Forward
            pos = pos + data[i][1];
            depth = depth + data[i][1] * aim;
        } else if (data[i][0] == 1) {  // Down (down increases depth)
            aim = aim + data[i][1];
        } else if (data[i][0] == 2) {  // Up
            aim = aim - data[i][1];
        }
    }
    std::cout << pos * depth;
    // std::cout << "\n" << pos << "\n" << depth << "\n" << aim;
    return 0;
}
