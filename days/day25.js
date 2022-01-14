const map = require("../inputs/day25");
const Utils = require("../utils/utils");

function moveEast() {
  let possibleMoves = [];
  Utils.nTimes(map.length, (lineI) => {
    let line = map[lineI];

    Utils.nTimes(line.length, (charI) => {
      let char = line[charI];
      if (char !== ">") return;

      let nextCharI = charI === line.length - 1 ? 0 : charI + 1;
      if (line[nextCharI] === ".") possibleMoves.push([lineI, charI, nextCharI]);
    });
  });

  possibleMoves.forEach(move => {
    let [lineI, charI, nextCharI] = move;
    map[lineI][charI] = ".";
    map[lineI][nextCharI] = ">";
  });

  return possibleMoves;
}

function moveSouth() {
  let possibleMoves = [];
  Utils.nTimes(map.length, (lineI) => {
    let line = map[lineI];

    Utils.nTimes(line.length, (charI) => {
      let char = line[charI];
      if (char !== "v") return;

      let nextLineI = lineI === map.length - 1 ? 0 : lineI + 1;
      if (map[nextLineI][charI] === ".") possibleMoves.push([lineI, charI, nextLineI]);
    });
  });

  possibleMoves.forEach(move => {
    let [lineI, charI, nextLineI] = move;
    map[lineI][charI] = ".";
    map[nextLineI][charI] = "v";
  });

  return possibleMoves;
}

let possibleMovesEast;
let possibleMovesSouth;
let steps = 0;
do {
  possibleMovesEast = moveEast();
  possibleMovesSouth = moveSouth();
  steps++;
} while (possibleMovesEast.length || possibleMovesSouth.length);

console.log(steps);
