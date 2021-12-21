const chalk = require("chalk");
const map = require("../inputs/day15");

// part one
const MAX_X = map[0].length - 1;
const MAX_Y = map.length - 1;
// magic constant, bigger => worse performance but more optimalization
// for example MAX_DEPTH = 3 means that the algorithm will check best route for 3 steps ahead
const MAX_DEPTH = 10;
const END = [MAX_X, MAX_Y];

function getAdjacentCoords(position, excludedPath, takenPath) {
  let [x, y] = position;
  let coords = [];

  if (x > 0) coords.push([x - 1, y]);
  if (x < MAX_X) coords.push([x + 1, y]);
  if (y > 0) coords.push([x, y - 1]);
  if (y < MAX_Y) coords.push([x, y + 1]);

  coords = coords.filter(coo => {
    let strCoo = coo.join(",");
    return !excludedPath.has(strCoo) && !takenPath.has(strCoo);
  });

  return coords;
}

function expandPath(position, currentPath, allPaths, takenPath) {
  if (currentPath.size > MAX_DEPTH || (position[0] === END[0] && position[1] === END[1])) {
    allPaths.push(currentPath);
    return allPaths;
  }

  let adjacentCoords = getAdjacentCoords(position, currentPath, takenPath);
  adjacentCoords.forEach(coords => {
    let newPath = new Set(currentPath);
    newPath.add(coords.join(","));
    expandPath(coords, newPath, allPaths, takenPath);
  });

  return allPaths;
}

function getRiskOfPath(path) {
  return Array.from(path).reduce((sum, coords) => {
    let [x, y] = coords.split(",").map(Number);
    sum += map[y][x];
    return sum;
  }, 0);
}

function findLowestRiskPath(paths) {
  let allRisks = paths.map(getRiskOfPath);

  let indexOfLowest = 0;
  allRisks.forEach((risk, i) => {
    if (allRisks[indexOfLowest] > risk) indexOfLowest = i;
  });

  return paths[indexOfLowest];
}

function drawPath(path) {
  map.forEach((line, y) => {
    let str = "";
    line.forEach((risk, x) => {
      if (path.has([x, y].join(","))) {
        str += chalk.red(risk);
      } else {
        str += risk;
      }
    });
    console.log(str);
  });
  console.log("\n");
}

let current = [0,0];
let takenPath = new Set();
while (!(current[0] === END[0] && current[1] === END[1])) {

  let possiblePaths = expandPath(current, new Set([current.join(",")]), [], takenPath);

  let lowestRiskPath = findLowestRiskPath(possiblePaths);

  current = Array.from(lowestRiskPath).pop().split(",").map(Number);
  takenPath = new Set([...takenPath, ...lowestRiskPath]);
}

drawPath(takenPath);

console.log(takenPath);
let excludeStartAndEnd = Array.from(takenPath);
excludeStartAndEnd.shift();
excludeStartAndEnd.pop();
console.log(getRiskOfPath(excludeStartAndEnd));
