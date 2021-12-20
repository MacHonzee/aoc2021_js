const numbers = require("../inputs/day7");

// part one
let smallest = Math.min(...numbers);
let highest = Math.max(...numbers);
let positions = {};
for (let i = smallest; i <= highest; i++) {
  positions[i] = 0;
  numbers.forEach(num => positions[i] = positions[i] + Math.abs(num - i));
}
let result = Math.min(...Object.values(positions));
console.log(result);

// part two
function sumOfLinearProgression(start, end) {
  let sum = 0;
  let smaller = Math.min(start, end);
  let bigger = Math.max(start, end);
  let diff = bigger - smaller;
  for (let i = 0; i <= diff; i++) {
    sum = sum + i;
  }
  return sum;
}

let positions2 = {};
for (let i = smallest; i <= highest; i++) {
  positions2[i] = 0;
  numbers.forEach(num => positions2[i] = positions2[i] + sumOfLinearProgression(num, i));
}
let result2 = Math.min(...Object.values(positions2));
console.log(result2);
