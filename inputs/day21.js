const string = `Player 1 starting position: 4
Player 2 starting position: 8`;

module.exports = string.split("\n").map(line => parseInt(line.match(/\d+$/)));
