const target = require("../inputs/day17");

function withinTarget(position, target) {
  let [x, y] = position;
  return x >= target.x.left && x <= target.x.right && y <= target.y.top && y >= target.y.bottom;
}

function getXvelocities(target) {
  let hitsTarget = new Set();
  for (let x = 1; x < 1000; x++) {
    // TODO I need to save number of steps needed to achieve target position, so that later we can
    // find matching Y velocity with same number of steps (if X reaches target in 2 steps, so should Y reach it in 2 steps too)
    let xPosition = 0;
    let velocity = x;
    while (velocity > 0 && xPosition <= target.x.right) {
      xPosition += velocity;
      velocity--;

      if (withinTarget([xPosition, target.y.top], target)) {
        hitsTarget.add(x);
      }
    }
  }

  return Array.from(hitsTarget);
}

function getYvelocities(target) {
  let hitsTarget = new Set();
  for (let y = -1000; y < 1000; y++) {
    let yPosition = 0;
    let velocity = y;
    while (yPosition >= target.y.bottom) {
      yPosition += velocity;
      velocity--;

      if (withinTarget([target.x.left, yPosition], target)) {
        hitsTarget.add(y);
      }
    }
  }

  return Array.from(hitsTarget);
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
let yVelocity = yVelocities[yVelocities.length - 1];
console.log(getHighestYposition(yVelocity));

// part two
// console.log(xVelocities.length * yVelocities.length);
