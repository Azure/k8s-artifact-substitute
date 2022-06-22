/**
 * Creates multiline string with each array element on a new line
 * @param arr array
 * @returns multiline string with each array element on new line
 */
export function GetMultilineStr(arr: string[]): string {
  return arr.join("\n");
}

/**
 * Traverses over every key and value in an object and performs operation on them
 * @param obj object you are iterating over
 * @param operation operation you are performing on the leafs
 */
export function TraverseObject(
  obj: any,
  operation: (key: string, value: string) => string
) {
  for (const key in obj) {
    if (key !== "e" && typeof obj[key] === "object") {
      TraverseObject(obj[key], operation);
    } else {
      obj[key] = operation(key, obj[key]);
    }
  }
}

/**
 * Splits multiline input into an array of strings
 * @param input multiline input
 * @returns input with each line as an element in an array
 */
export function SplitMultilineInput(input: string): string[] {
  return input
    .split(/[\n,;]+/) // split into each line
    .map((manifest) => manifest.trim()) // remove surrounding whitespace
    .filter((manifest) => manifest.length > 0); // remove any blanks
}
