const map = require("../inputs/day9");

// part 1
function checkPoint(line, i, y) {
  let point = line[y];
  if (i > 0) {
    if (map[i-1][y] <= point) return;
  }

  if (i < map.length - 1) {
    if (map[i+1][y] <= point) return;
  }

  if (y > 0) {
    if (map[i][y-1] <= point) return;
  }

  if (y < line.length - 1) {
    if (map[i][y+1] <= point) return;
  }

  return true;
}

let validPoints = [];
for (let i = 0; i < map.length; i++) {
  let line = map[i];
  for (let y = 0; y < line.length; y++) {
    if (checkPoint(line, i, y)) {
      validPoints.push(line[y]);
    }
  }
}

console.log(validPoints.reduce((sum, point) => sum + point + 1, 0));

// part two
function checkBasin(basin, line, i, y) {
  let point = line[y];
  if (point === 9) return;

  let top;
  if (i > 0) {
    top = map[i-1][y];
  }

  let bottom;
  if (i < map.length - 1) {
    bottom = map[i+1][y];
  }

  let left;
  if (y > 0) {
    left = map[i][y-1];
  }

  let right;
  if (y < line.length - 1) {
    right = map[i][y+1];
  }

  checkDiff(basin, point, top, i, y, i - 1, y);
  checkDiff(basin, point, bottom, i, y, i + 1, y);
  checkDiff(basin, point, left, i, y, i, y - 1);
  checkDiff(basin, point, right, i, y, i, y + 1);
}

function checkDiff(basin, point, pointTwo, i, y, i2, y2) {
  if (
    pointTwo == null ||
    pointTwo === 9 ||
    point > pointTwo ||
    (basin[i2] && basin[i2][y2])) return;

  basin[i] = basin[i] || {};
  basin[i][y] = point;

  basin[i2] = basin[i2] || {};
  basin[i2][y2] = pointTwo;

  checkBasin(basin, map[i2], i2, y2);
}

let validBasins = [];
for (let i = 0; i < map.length; i++) {

  let line = map[i];
  for (let y = 0; y < line.length; y++) {
    let basin = {};
    checkBasin(basin, line, i, y);

    // add optimizing strings of keys
    basin.xKeys = Object.keys(basin).sort().join("|");
    for (let x of Object.keys(basin)) {
      basin[x].yKeys = Object.keys(basin[x]).sort().join("|");
    }

    // now we need to check whether the found basin is unique based on its coordinates
    if (basin.xKeys) {
      let unique = true;
      for (let validBasin of validBasins) {
        if (basin.xKeys === validBasin.xKeys) {
          let allYsame = true;
          for (let x of Object.keys(basin)) {
            let y1keys = basin[x].yKeys;
            let y2keys = validBasin[x].yKeys;
            if (y1keys !== y2keys) {
              allYsame = false;
              break;
            }
          }

          if (allYsame) {
            unique = false;
            break;
          }
        }
      }

      if (unique) {
        validBasins.push(basin);
      }
    }

  }
}

for (let basin of validBasins) {
  basin.size = 0;
  Object.keys(basin).forEach(i => {
    if (i === "xKeys") return;
    Object.keys(basin[i]).forEach(y => {
      if (y === "yKeys") return;
      basin.size++;
    });
  });
}

let biggestBasins = validBasins.sort((a, b) => a.size - b.size).splice(validBasins.length - 3, 3);
console.log(biggestBasins.reduce((product, basin) => product * basin.size, 1));

console.log("That's not the right answer; your answer is too low : 919100");
