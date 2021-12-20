const { start, map } = require("../inputs/day14");

// part one
function getResult(string) {
  let quantities = {};
  string.split("").forEach(char => {
    quantities[char] = quantities[char] || 0;
    quantities[char]++;
  });
  let values = Object.values(quantities);
  let min = Math.min(...values);
  let max = Math.max(...values);
  return max - min;
}

let currentString = start;
for (let i = 0; i < 10; i++) {
  let newString = "";
  currentString.split("").forEach((char, y) => {
    if (y === 0) {
      newString += char;
    }

    if (y !== currentString.length - 1) {
      let nextChar = currentString[y + 1];

      let double = char + nextChar;
      if (map[double]) {
        newString += map[double];
      }

      newString += nextChar;
    }
  });
  currentString = newString;
}

console.log(getResult(currentString));

// part two
// TODO
