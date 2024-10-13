
interface TestCaseBoxDetailsProps {
    expectedOutput: string,
    output: string, 
}

const TestCaseBoxDetails = ({expectedOutput, output}: TestCaseBoxDetailsProps) => {
    return ( 
        <div className="w-full">
            <p>input: </p>
            <p className="w-full h-fit m-2 px-2 bg-gray-600 rounded-md">{expectedOutput}</p>
            <p>output: </p>
            <p className="w-full h-fit m-2 px-2 bg-gray-600 rounded-md">{output}</p>
        </div>
     );
}
 
export default TestCaseBoxDetails;