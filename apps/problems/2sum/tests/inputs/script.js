const readline = require('readline');
const fs = require('fs');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input and create file
async function createFileWithTwoLines() {
    try {
        // Get filename
        const filename = await new Promise(resolve => {
            rl.question('Enter the filename (without .txt extension): ', answer => {
                resolve(answer);
            });
        });

        // Get first line
        const line1 = await new Promise(resolve => {
            rl.question('Enter the first line: ', answer => {
                resolve(answer);
            });
        });

        // Get second line
        const line2 = await new Promise(resolve => {
            rl.question('Enter the second line: ', answer => {
                resolve(answer);
            });
        });

        // Create and write to file
        const fullFilename = `${filename}.txt`;
        fs.writeFileSync(fullFilename, line1 + '\n' + line2);

        console.log(`\nFile '${fullFilename}' has been created successfully!`);
        console.log('Written content:');
        console.log('Line 1:', line1);
        console.log('Line 2:', line2);

    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        rl.close();
    }
}

// Run the program
createFileWithTwoLines();