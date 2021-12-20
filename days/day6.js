const numbers = require("../inputs/day6");

// part 1
const LAST_DAY = 80;
let fishCopy1 = [...numbers];
for (let day = 1; day <= LAST_DAY; day++) {
  for (let i = 0; i < fishCopy1.length; i++) {
    if (fishCopy1[i] === 0) {
      fishCopy1[i] = 6;
      fishCopy1.push(9);
    } else {
      fishCopy1[i] = fishCopy1[i] - 1;
    }
  }
}
console.log(fishCopy1.length);

// part 2 - same shit, but get out of heap error
const FINAL_DAY = 256;
let fishCopy2 = [...numbers];
let fishCounts = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0
};
fishCopy2.forEach(int => {
  fishCounts[int.toString()] = fishCounts[int.toString()] + 1;
});

for (let day = 1; day <= FINAL_DAY; day++) {
  for (let age of Object.keys(fishCounts)) {
    if (age === "0") {
      fishCounts["7"] = fishCounts["7"] + fishCounts[age];
      fishCounts["9"] = fishCounts["9"] + fishCounts[age];
    } else {
      let lower = (age - 1).toString();
      fishCounts[lower] = fishCounts[lower] + fishCounts[age];
    }

    fishCounts[age] = 0;
  }
}

console.log(Object.values(fishCounts).reduce((sum, fish) => sum + fish, 0));

