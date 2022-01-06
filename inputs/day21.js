const string = `Player 1 starting position: 1
Player 2 starting position: 10`;

module.exports = string.split("\n").map(line => parseInt(line.match(/\d+$/)));
