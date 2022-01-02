const target = require("../inputs/day17");

function withinTarget(position, target) {
  let [x, y] = position;
  return x >= target.x.left && x <= target.x.right && y <= target.y.top && y >= target.y.bottom;
}

function getXvelocities(target) {
  let hitsTarget = {};
  for (let x = 1; x < 1000; x++) {
    let xPosition = 0;
    let velocity = x;
    let step = 0;
    while (velocity > 0 && xPosition <= target.x.right) {
      xPosition += velocity;
      velocity--;
      step++;

      if (withinTarget([xPosition, target.y.top], target)) {
        hitsTarget[x] = step;
      }
    }
  }

  return hitsTarget;
}

function getYvelocities(target) {
  let hitsTarget = {};
  for (let y = -1000; y < 1000; y++) {
    let yPosition = 0;
    let velocity = y;
    let step = 0;
    while (yPosition >= target.y.bottom) {
      yPosition += velocity;
      velocity--;
      step++;

      if (withinTarget([target.x.left, yPosition], target)) {
        hitsTarget[y] = step;
      }
    }
  }

  return hitsTarget;
}

function getHighestYposition(velocity) {
  let trajectory = [];
  let yPosition = 0;
  while (yPosition >= target.y.bottom) {
    trajectory.push(yPosition);
    yPosition += velocity;
    velocity--;
  }

  return Math.max(...trajectory);
}

let xVelocities = getXvelocities(target);
let yVelocities = getYvelocities(target);

// part one
let yVelocity = Object.keys(yVelocities).sort((a, b) => a - b).pop();
console.log(getHighestYposition(parseInt(yVelocity)));

// part two
function getAllPossiblePairs(target) {
  let allPairs = new Set();

  for (let x = 1; x <= target.x.right; x++) {
    for (let y = target.y.bottom; y <= 5000; y++) {
      let xPosition = 0;
      let xVelocity = x;
      let yPosition = 0;
      let yVelocity = y;

      while (xPosition <= target.x.right && yPosition >= target.y.bottom) {
        xPosition += xVelocity;
        yPosition += yVelocity;
        if (xVelocity > 0) xVelocity--;
        yVelocity--;

        if (withinTarget([xPosition, yPosition], target)) {
          allPairs.add(`${x},${y}`);
        }
      }
    }
  }

  return allPairs;
}

// answer 2304 is too low
let allPossiblePairs = getAllPossiblePairs(target);
console.log(allPossiblePairs.size);

