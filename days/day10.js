const lines = require("../inputs/day10");

// part one
const SCORE_MAP = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const BRACKET_OPENERS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">"
};
const BRACKET_CLOSERS = Object.entries(BRACKET_OPENERS).reduce((map, [opener, closer]) => {
  map[closer] = opener;
  return map;
}, {});

function checkLine (line) {
  let waitingBrackets = [];
  for (let i = 0; i < line.length; i++) {
    let char = line[i];
    if (BRACKET_OPENERS[char]) {
      waitingBrackets.push(char);
    } else {
      let lastBracket = waitingBrackets[waitingBrackets.length - 1];
      if (BRACKET_CLOSERS[char] === lastBracket) {
        waitingBrackets.pop();
      } else {
        return {invalid: true, char};
      }
    }
  }

  if (waitingBrackets.length > 0) {
    return {incomplete: true, waitingBrackets};
  } else {
    return {valid: true};
  }
}

const illegalChars = [];
lines.forEach(line => {
  let result = checkLine(line);
  if (result.invalid) illegalChars.push(result.char);
});

console.log(illegalChars.reduce((sum, char) => sum + SCORE_MAP[char], 0));

// part two
const AUTOCOMPLETE_SCORES = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4
};

const addedBracketsScore = [];
lines.forEach(line => {
  let result = checkLine(line);
  if (result.incomplete) {
    let missingBrackets = [];
    for (let i = result.waitingBrackets.length - 1; i >= 0; i--) {
      let bracket = result.waitingBrackets[i];
      let closingBracket = BRACKET_OPENERS[bracket];
      missingBrackets.push(closingBracket);
    }

    let score = missingBrackets.reduce((sum, char) => (sum * 5) + AUTOCOMPLETE_SCORES[char], 0);
    addedBracketsScore.push(score);
  }
});

let middleIndex = Math.floor(addedBracketsScore.length / 2);
console.log(addedBracketsScore.sort((a, b) => a - b)[middleIndex]);
