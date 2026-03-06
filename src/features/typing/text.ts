export function splitParagraphs(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0);
}

export function countTypos(reference: string, input: string) {
  let typoCount = 0;

  for (let index = 0; index < input.length; index += 1) {
    if (input[index] !== reference[index]) {
      typoCount += 1;
    }
  }

  return typoCount;
}

export function countCorrectCharacters(reference: string, input: string) {
  let correctCount = 0;

  for (let index = 0; index < input.length; index += 1) {
    if (input[index] === reference[index]) {
      correctCount += 1;
    }
  }

  return correctCount;
}
