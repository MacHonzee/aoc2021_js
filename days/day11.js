const map = require("../inputs/day11");

const ROW_LENGTH = 10;

// part one and two mixed together
let flashCounter = [];

function lightUp(data, i) {
  data[i] = 0;
  flashCounter[flashCounter.length - 1]++;

  let adjacentIndexes = getAdjacentIndexes(i);
  adjacentIndexes.forEach((i2) => {
    if (data[i2] !== 0) {
      data[i2] = data[i2] + 1;
    }

    if (data[i2] > 9) {
      lightUp(data, i2);
    }
  });
}

function increaseEnergy(data) {
  data.forEach((cell, i) => {
    data[i] = data[i] + 1;
  });

  flashCounter.push(0);

  data.forEach((cell, i) => {
    if (data[i] > 9) {
      lightUp(data, i);
    }
  });

  if (flashCounter[flashCounter.length - 1] === 100) {
    throw "Add 1 to last step and you have result for part two";
  }
}

function debugMap(step, data) {
  let newMap = "";
  data.forEach((cell, i) => {
    if (i > 0 && i % 10 === 0) {
      newMap += "\n";
    }
    newMap += cell.toString();
  });
  console.log("step: " + step);
  console.log(newMap + "\n\n");
}

function getAdjacentIndexes(i) {
  let rowI = i % ROW_LENGTH;
  let indexes = [];

  let notInFirstColumn = rowI > 0;
  let notOnFirstRow = i >= ROW_LENGTH;
  let notInLastColumn = rowI < ROW_LENGTH - 1;
  let notOnLastRow = i < map.length - ROW_LENGTH;

  if (notInFirstColumn && notOnFirstRow) indexes.push(i - 1 - ROW_LENGTH);
  if (notOnFirstRow) indexes.push(i - ROW_LENGTH);
  if (notInLastColumn && notOnFirstRow) indexes.push(i + 1 - ROW_LENGTH);

  if (notInFirstColumn) indexes.push(i - 1);
  if (notInLastColumn) indexes.push(i + 1);

  if (notInFirstColumn && notOnLastRow) indexes.push(i - 1 + ROW_LENGTH);
  if (notOnLastRow) indexes.push(i + ROW_LENGTH);
  if (notInLastColumn && notOnLastRow) indexes.push(i + 1 + ROW_LENGTH);

  return indexes;
}

const STEPS = 1000;
const mapCopy1 = JSON.parse(JSON.stringify(map));
debugMap(0, mapCopy1);
for (let step = 1; step <= STEPS; step++) {
  increaseEnergy(mapCopy1);
  debugMap(step, mapCopy1);
}

console.log(flashCounter.flat().reduce((sum, i) => sum + i, 0));

// part two
