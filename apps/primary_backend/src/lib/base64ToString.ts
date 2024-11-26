export const base64ToString = (input: string) => {
    if(typeof input === "string"){
        const buff = Buffer.from(input, "base64");
        return buff.toString("utf-8");
    }
    return "";
}