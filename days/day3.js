const input = require("../inputs/day3");

// part 1
function findCommonBit(arr, index) {
  let count0 = 0;
  let count1 = 0;
  arr.forEach(bits => {
    if (bits[index] === "0") count0++;
    if (bits[index] === "1") count1++;
  });
  return count0 > count1 ? "0" : "1";
}

const commonBits = [];
const uncommonBits = [];
const length = input[0].trim().length;
for (let i = 0; i < length; i++) {
  let commonBit = findCommonBit(input, i);
  commonBits.push(commonBit);
  uncommonBits.push(commonBit === "0" ? "1" : "0");
}

let result = parseInt(commonBits.join(""), 2) * parseInt(uncommonBits.join(""), 2);
console.log(result);

if (result !== 4001724) throw "bullshit";

// part 2
// TODO it should be possible to use binary search on sorted input and divide it more efficiently, to find
// the number made of most common and most uncommon characters
// sort it -> find index of first "1" in the index -> split it by the index, and then repeat all for 12 indexes

// this is a different, less efficient solution. At least O(n^2) complexity
let currentArray = [...input];
for (let i = 0; i < length; i++) {
  let commonBit = findCommonBit(currentArray, i);
  currentArray = currentArray.filter(bits => bits[i] === commonBit);
}
let oxygen = parseInt(currentArray[0], 2);

currentArray = [...input];
for (let i = 0; i < length; i++) {
  if (currentArray.length === 1) break;
  let commonBit = findCommonBit(currentArray, i);
  let uncommonBit = commonBit === "1" ? "0" : "1";
  currentArray = currentArray.filter(bits => bits[i] === uncommonBit);
}
let co2 = parseInt(currentArray[0], 2);

console.log(oxygen * co2);

