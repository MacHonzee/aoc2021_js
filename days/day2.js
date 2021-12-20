const movements = require("../inputs/day2");

// part 1
const position = {
  forward: 0,
  up: 0,
  down: 0
};

movements.forEach(move => {
  let [direction, howMuch] = move.split(" ");
  position[direction] += parseInt(howMuch);
});

console.log(position);
console.log(position.forward * (position.down - position.up));

// part 2
let currentForward = 0;
let currentDepth = 0;
let currentAim = 0;
movements.forEach(move => {
  let [direction, howMuch] = move.split(" ");
  howMuch = parseInt(howMuch);
  if (direction === "forward") {
    currentForward += howMuch;
    currentDepth += (howMuch * currentAim);
  } else {
    currentAim = direction === "up" ? currentAim - howMuch : currentAim + howMuch;
  }
  // console.log("direction", direction, "howMuch", howMuch, "currentAim", currentAim, "currentDepth", currentDepth);
});

console.log("result", currentForward * currentDepth);
