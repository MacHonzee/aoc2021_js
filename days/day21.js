const Utils = require("../utils");
const [player1start, player2start] = require("../inputs/day21");

const MAX_SCORE = 1000;
const BOARD = {
  start: 1,
  end: 10,
};
const TURNS = 3;

class DeterministicDice {
  constructor() {
    this.SIDES = 100;
    this._lastRoll = 0;
  }

  roll() {
    this._lastRoll++;
    if (this._lastRoll > this.SIDES) this._lastRoll = 1;
    return this._lastRoll;
  }
}

class Player {
  constructor(start) {
    this._score = 0;
    this._position = start;
  }

  move(rolled) {
    this._position += rolled;
    if (this._position > BOARD.end) {
      this._position = this._position % BOARD.end;
      if (this._position === 0) this._position = BOARD.end;
    }
    return this;
  }

  saveScore() {
    this._score += this._position;
  }

  get score() {
    return this._score;
  }
}

function solvePartOne() {
  let dice = new DeterministicDice();
  let player1 = new Player(player1start);
  let player2 = new Player(player2start);

  let diceRolls = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let player1roll = 0;
    Utils.nTimes(TURNS, () => {
      player1roll += dice.roll();
    });
    player1.move(player1roll).saveScore();
    diceRolls += TURNS;
    if (player1.score >= MAX_SCORE) return diceRolls * player2.score;

    let player2roll = 0;
    Utils.nTimes(TURNS, () => {
      player2roll += dice.roll();
    });
    player2.move(player2roll).saveScore();
    diceRolls += TURNS;
    if (player2.score >= MAX_SCORE) return diceRolls * player1.score;
  }
}

console.log(solvePartOne());

function solvePartTwo() {}

console.log(solvePartTwo());
