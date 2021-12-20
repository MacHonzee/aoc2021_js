const { coords, folds } = require("../inputs/day13");

function debugMap(map) {
  let numbers = map.map(coords => coords.split(",").map(Number));
  let maxX = Math.max(...numbers.map(nums => nums[0]));
  let maxY = Math.max(...numbers.map(nums => nums[1]));

  let newMap = [];
  for (let y = 0; y <= maxY; y++) {
    let newRow = [];
    for (let x = 0; x <= maxX; x++) {
      newRow.push(".");
    }
    newMap.push(newRow.join(""));
  }

  for (let [x, y] of numbers) {
    newMap[y] = newMap[y].substr(0, x) + "#" + newMap[y].substr(x + 1, maxX);
  }

  console.log(newMap.join("\n"));
}

// part one
let map = [...coords];
for (let [axis, line] of folds) {
  // debugMap(map);

  let newMap = [];
  for (let point of map) {
    let pointCoords = point.split(",").map(Number);

    // check if it is on top or left part of map
    if ((axis === "x" && pointCoords[0] < line) || (axis === "y" && pointCoords[1] < line)) {
      newMap.push(point);
      continue;
    }

    // check for errors
    if ((axis === "x" && pointCoords[0] === line) || (axis === "y" && pointCoords[1] === line)) {
      console.error(axis, line);
      throw "Unexpected input";
    }

    // fold the point by the axis
    let newPoint;
    if (axis === "x") {
      // TODO investigate why the fuck I need the magic (- 1) here
      newPoint = [pointCoords[0] - (2 * (pointCoords[0] - line)) - 1, pointCoords[1]];
    } else {
      newPoint = [pointCoords[0], pointCoords[1] - (2 * (pointCoords[1] - line)) - 1];
    }
    newPoint = newPoint.join(",");

    // check unique point
    if (!newMap.includes(newPoint)) {
      newMap.push(newPoint);
    }
  }

  // and go for next fold
  map = [...newMap];

  break;
}

// debugMap(map);
console.log("845 ani 897 to není");
console.log(map.length);
