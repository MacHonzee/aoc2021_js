const chalk = require("chalk");
const map = require("../inputs/day15");

// part one
const MAX_X = map[0].length - 1;
const MAX_Y = map.length - 1;
// magic constant, bigger => worse performance but more optimalization
// for example MAX_DEPTH = 3 means that the algorithm will check best route for 3 steps ahead
const MAX_DEPTH = 25;
const END = [MAX_X, MAX_Y];

const RISK_MAP = map.reduce((final, line, y) => {
  line.forEach((risk, x) => {
    final[`${x},${y}`] = risk;
  });
  return final;
}, {});

function getNextCoords (position, excludedPath, takenPath) {
  let [x, y] = position;
  let coords = [];
  let strCoords = [];

  let leftStr = `${x + 1},${y}`;
  let bottomStr = `${x},${y + 1}`;
  if (x < MAX_X && !excludedPath.has(leftStr) && !takenPath.has(leftStr)) {
    coords.push([x + 1, y]);
    strCoords.push(leftStr);
  }
  if (y < MAX_Y && !excludedPath.has(bottomStr) && !takenPath.has(bottomStr)) {
    coords.push([x, y + 1]);
    strCoords.push(bottomStr);
  }

  return { coords, strCoords };
}

function expandPath (position, currentPath, lowestRiskPath, takenPath) {
  if (currentPath.size > MAX_DEPTH || (position[0] === END[0] && position[1] === END[1])) {
    let pathRisk = getRiskOfPath(currentPath);
    if (!lowestRiskPath.risk || lowestRiskPath.risk > pathRisk) {
      lowestRiskPath.risk = pathRisk;
      lowestRiskPath.path = currentPath;
    }
    return lowestRiskPath;
  }

  let { coords: nextCoords, strCoords } = getNextCoords(position, currentPath, takenPath);
  nextCoords.forEach((coords, i) => {
    let newPath = new Set([...currentPath, strCoords[i]]);
    expandPath(coords, newPath, lowestRiskPath, takenPath);
  });

  return lowestRiskPath;
}

function getRiskOfPath (path) {
  return Array.from(path).reduce((sum, coords) => sum + RISK_MAP[coords], 0);
}

function drawPath (path) {
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

let current = [0, 0];
let takenPath = new Set();
while (!(current[0] === END[0] && current[1] === END[1])) {
  console.log(current);

  let lowestRiskPath = expandPath(current, new Set([current.join(",")]), {}, takenPath);

  current = Array.from(lowestRiskPath.path).pop().split(",").map(Number);
  takenPath = new Set([...takenPath, ...lowestRiskPath.path]);
}

drawPath(takenPath);

let finalRisk = getRiskOfPath(takenPath);
finalRisk -= map[0][0];
// 405 ani 535 to není (answer was too high)
console.log(finalRisk);

