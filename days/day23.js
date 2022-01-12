const map = require("../inputs/day23");

const HALL_PLACES = new Set([0, 1, 3, 5, 7, 9, 10]);
const ENERGIES = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

function drawMap(map) {
  let { hall, slots } = map;
  console.log("#############");
  console.log(`#${hall.map(place => place || ".").join("")}#`);
  console.log(`###${slots[0][0]}#${slots[1][0]}#${slots[2][0]}#${slots[3][0]}###`);
  console.log(`  #${slots[0][1]}#${slots[1][1]}#${slots[2][1]}#${slots[3][1]}#`);
  console.log("  #########");
}

function isSolved(map) {
  let { slots } = map;
  return slots[0][0] === "A" && slots[0][1] === "A" &&
    slots[1][0] === "B" && slots[1][1] === "B" &&
    slots[2][0] === "C" && slots[2][1] === "C" &&
    slots[3][0] === "D" && slots[3][1] === "D";
}

function solvePartOne(map) {
}

solvePartOne(map);
