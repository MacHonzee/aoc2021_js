const vents = require("../inputs/day5");

// part 1
function calculatePartOne() {
  let map = [];
  vents.forEach(([start, end]) => {
    if (start[0] !== end[0] && start[1] !== end[1]) return;

    let xStart = Math.min(start[0], end[0]);
    let xEnd = Math.max(start[0], end[0]);

    let yStart = Math.min(start[1], end[1]);
    let yEnd = Math.max(start[1], end[1]);

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        map[x] = map[x] || [];
        map[x][y] = map[x][y] || 0;
        map[x][y]++;
      }
    }

  });

  let result = map.reduce((sum, line) => sum + (line.filter(int => int >= 2).length), 0);
  console.log(result);
}
calculatePartOne();

// part 2
function calculatePartTwo() {
  let map = [];
  vents.forEach(([start, end]) => {
    let isDiagonal = Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1]);
    let isStraight = start[0] === end[0] || start[1] === end[1];
    if (!isStraight && !isDiagonal) {
      // does not happen
      console.log(start, end);
      return;
    }

    let addX = start[0] < end[0];
    let addY = start[1] < end[1];

    let currentX = start[0];
    let currentY = start[1];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      map[currentX] = map[currentX] || [];
      map[currentX][currentY] = map[currentX][currentY] || 0;
      map[currentX][currentY]++;

      if (currentX === end[0] && currentY === end[1]) break;

      if (currentX !== end[0]) {
        addX ? currentX++ : currentX--;
      }

      if (currentY !== end[1]) {
        addY ? currentY++ : currentY--;
      }
    }

    // console.log(map);
  });

  let result = map.reduce((sum, line) => sum + (line.filter(int => int >= 2).length), 0);
  console.log(result);
}

calculatePartTwo();
