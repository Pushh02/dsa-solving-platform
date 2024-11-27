export const calculateAvgTime = (timeArray: string[] | number[]) : number => {
    let avgTime = 0;
    for (let i = 0; i < timeArray.length; i++) {
    if(timeArray[i] != null)
        avgTime += Number(timeArray[i]);
    }
    return avgTime = avgTime / timeArray.length;
}

export const calculateAvgMemory = (MemoryArray: string[] | number[]) : number => {
    let avgMemory = 0;
    for (let i = 0; i < MemoryArray.length; i++) {
    if(MemoryArray[i] != null)
        avgMemory += Number(MemoryArray[i]);
    }
    return avgMemory = avgMemory / MemoryArray.length;
}