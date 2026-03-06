export interface TypingJudgeOptions {
  punctuationAndCaseStrict: boolean;
}

const DEFAULT_TYPING_JUDGE_OPTIONS: TypingJudgeOptions = {
  punctuationAndCaseStrict: true,
};

function isPunctuation(character: string) {
  return /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(character);
}

function isWhitespace(character: string) {
  return character === ' ' || character === '\n' || character === '\t';
}

export function isCharacterMatch(
  referenceCharacter: string | undefined,
  inputCharacter: string | undefined,
  options: TypingJudgeOptions = DEFAULT_TYPING_JUDGE_OPTIONS,
) {
  if (!referenceCharacter || !inputCharacter) {
    return false;
  }

  if (options.punctuationAndCaseStrict) {
    return referenceCharacter === inputCharacter;
  }

  if (isWhitespace(referenceCharacter) || isWhitespace(inputCharacter)) {
    return referenceCharacter === inputCharacter;
  }

  if (isPunctuation(referenceCharacter) || isPunctuation(inputCharacter)) {
    return isPunctuation(referenceCharacter) && isPunctuation(inputCharacter);
  }

  return referenceCharacter.toLocaleLowerCase() === inputCharacter.toLocaleLowerCase();
}

export function splitParagraphs(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0);
}

export function countTypos(
  reference: string,
  input: string,
  options: TypingJudgeOptions = DEFAULT_TYPING_JUDGE_OPTIONS,
) {
  let typoCount = 0;

  for (let index = 0; index < input.length; index += 1) {
    if (!isCharacterMatch(reference[index], input[index], options)) {
      typoCount += 1;
    }
  }

  return typoCount;
}

export function countCorrectCharacters(
  reference: string,
  input: string,
  options: TypingJudgeOptions = DEFAULT_TYPING_JUDGE_OPTIONS,
) {
  let correctCount = 0;

  for (let index = 0; index < input.length; index += 1) {
    if (isCharacterMatch(reference[index], input[index], options)) {
      correctCount += 1;
    }
  }

  return correctCount;
}
