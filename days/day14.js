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

function calculateString(start, steps) {
  let currentString = start;
  for (let i = 0; i < steps; i++) {
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
  return currentString;
}

console.time("var1");
let currentString = calculateString(start, 10);
console.timeEnd("var1");
console.log(getResult(currentString));

// part two
const COMBINATION_CACHE = {};
const COMBINATION_SIZES = {};

function eachPair(string, cb) {
  let lastIndex = string.length - 1;
  string.split("").forEach((char, i) => {
    if (i !== lastIndex) {
      let pair = char + string[i + 1];
      cb(pair, i);
    }
  });
}

function polymeratePair(pair, lastStep) {
  let polymer = COMBINATION_CACHE[pair];
  if (!polymer) {
    polymer = calculateString(pair, lastStep);
    COMBINATION_CACHE[pair] = polymer;
  }
  return polymer;
}

function quantifyPolymer(pair, pairI, polymer) {
  let quantities = COMBINATION_SIZES[pair];
  if (!quantities) {
    quantities = {};
    let startI = pairI === 0 ? 0 : 1;
    for (let i = startI; i < polymer.length; i++) {
      let char = polymer[i];
      quantities[char] = quantities[char] || 0;
      quantities[char]++;
    }
    COMBINATION_SIZES[pair] = quantities;
  }

  return quantities;
}

function optimizedCalcString(start) {
  let HALF_STEP = 20;

  // build half of the final string
  let firstHalf = "";
  eachPair(start, (pair, pairI) => {
    let polymer = polymeratePair(pair, HALF_STEP);
    if (pairI === 0) {
      firstHalf += polymer;
    } else {
      firstHalf += polymer.substr(1);
    }
  });

  console.log("First half calculated");

  // then just add up quantities of characters
  let quantities = {};
  eachPair(firstHalf, (pair, pairI) => {
    let polymer = polymeratePair(pair, HALF_STEP);
    let polymerQuantities = quantifyPolymer(pair, pairI, polymer);
    Object.keys(polymerQuantities).forEach(char => {
      quantities[char] = quantities[char] || 0;
      quantities[char] += polymerQuantities[char];
    });
  });

  let values = Object.values(quantities);
  let min = Math.min(...values);
  let max = Math.max(...values);
  return max - min;
}

console.time("var2");
let resultTwo = optimizedCalcString(start);
console.log(resultTwo);
console.timeEnd("var2");
