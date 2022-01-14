const Utils = require("../utils/utils");
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
  constructor(start, startScore = 0) {
    this._position = start;
    this._score = startScore;
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
    return this;
  }

  get score() {
    return this._score;
  }

  get position() {
    return this._position;
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

const QUANTUM_MAX_SCORE = 21;

let winsCounter = {
  one: 0,
  two: 0,
};

function solvePartTwo() {
  let player1 = new Player(player1start);
  let player2 = new Player(player2start);

  playQuantumGame(player1, player2, "one");

  return winsCounter;
}

function playQuantumGame(player1, player2, whoPlays) {
  let playingPlayer = whoPlays === "one" ? player1 : player2;
  if (playingPlayer.score >= QUANTUM_MAX_SCORE) {
    winsCounter[whoPlays]++;
    return;
  }

  let oppositeTurn = whoPlays === "one" ? "two" : "one";

  let playerVariant1 = new Player(playingPlayer.position, playingPlayer.score).move(1).saveScore();
  playQuantumGame(
    whoPlays === "one" ? playerVariant1 : player1,
    whoPlays === "two" ? playerVariant1 : player2,
    oppositeTurn
  );

  let playerVariant2 = new Player(playingPlayer.position, playingPlayer.score).move(2).saveScore();
  playQuantumGame(
    whoPlays === "one" ? playerVariant2 : player1,
    whoPlays === "two" ? playerVariant2 : player2,
    oppositeTurn
  );

  let playerVariant3 = new Player(playingPlayer.position, playingPlayer.score).move(3).saveScore();
  playQuantumGame(
    whoPlays === "one" ? playerVariant3 : player1,
    whoPlays === "two" ? playerVariant3 : player2,
    oppositeTurn
  );
}

console.log(solvePartTwo());
