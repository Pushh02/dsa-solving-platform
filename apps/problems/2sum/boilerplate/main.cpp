#include <iostream>
#include <bits/stdc++.h>

using namespace std;

//##USERS_CODE_HERE

int main()
{
    try{
        ifstream inFile("/dev/problems/2sum/tests/inputs/##INPUT_FILE_INDEX##.txt");
        if (!inFile.is_open()){
            cerr << "Error: Failed to open file:" << endl;
            return 1;
        }

        ifstream expectedFile("/dev/problems/2sum/tests/outputs/##OUTPUT_FILE_INDEX##.txt");
        if (!expectedFile.is_open()){
            cerr << "Error: Failed to open expected file:" << endl;
            return 1;
        }

        int target;
        string line;

        // Read the target from the first line
        getline(inFile, line);
        stringstream(line) >> target;

        // Read the nums array from the second line
        getline(inFile, line);
        stringstream ss(line);
        vector<int> nums;
        string num_str;

        while (getline(ss, num_str, ',')){
            nums.push_back(stoi(num_str));
        }

        // Close the file
        inFile.close();

        // Create a Solution object and use the twoSum method
        Solution op;
        vector<int> output = op.twoSum(nums, target);

        ostringstream actualStream;
        for (int i = 0; i < output.size(); i++){
            actualStream << output[i];
        }

        string actualOutput = actualStream.str();
        string expectedOutput((istreambuf_iterator<char>(expectedFile)),istreambuf_iterator<char>());

        actualOutput.erase(remove_if(actualOutput.begin(), actualOutput.end(), ::isspace), actualOutput.end());
        expectedOutput.erase(remove_if(expectedOutput.begin(), expectedOutput.end(), ::isspace), expectedOutput.end());

        if(actualOutput == expectedOutput){
            cout<<"yay!";
            return 0;
        } else {
            cout<<inFile.get();
            cout<<"hello";
            return 1;
        }
    } catch (...){
        cerr << "An error occurred." << endl;
        return 1;
    }
}