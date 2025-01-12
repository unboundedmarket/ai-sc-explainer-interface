/**
 * Removes line numbers from a block of text.
 *
 * @param text - The input text with potential line numbers.
 * @returns A string without any starting line numbers.
 */
export function removeLineNumbers(text: string): string {
  return text.replace(/^[0-9]+/gm, "");
}

/**
 * Formats a string for prompts, given an instruction and input text.
 *
 * @param instruction - The instruction or prompt.
 * @param inputStr - The input text that needs explaining.
 * @returns A formatted string combining the instruction and input.
 */
export function formatString(instruction: string, inputStr: string): string {
  return `### Instruction:\n${instruction}\n\n### Input:\n${inputStr}\n\n### Response:\n`;
}