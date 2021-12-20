const numbers = require("../inputs/day1");

function getCountOfIncreases(arr) {
  let biggerMeasurements = 0;
  arr.forEach((num, i) => {
    if (num && i > 0 && num > arr[i - 1]) {
      biggerMeasurements++
    }
  });
  return biggerMeasurements;
}

// part 1
console.log("part 1", getCountOfIncreases(numbers));

// par 2
let lastIndex = numbers.length - 3;
let allSums = [];
numbers.forEach((num, i) => {
  if (i <= lastIndex) {
    allSums.push(numbers[i] + numbers[i + 1] + numbers[i + 2]);
  }
});
console.log("part 2", getCountOfIncreases(allSums));
