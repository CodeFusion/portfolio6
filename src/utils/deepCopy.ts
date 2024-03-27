export const deepCopy = <T>(input: T|undefined): T|null => {
  return JSON.parse(JSON.stringify(input ?? null))
}
