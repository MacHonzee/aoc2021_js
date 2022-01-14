const Utils = require("./utils");

class Grid2d {
  constructor(gridData) {
    this._data = gridData;
    this._rowLength = gridData[0] ? gridData[0].length : 0;
  }

  eachLine(cb) {
    this._data.forEach(cb);
  }

  eachColumn(cb) {
    Utils.nTimes(this._rowLength, (i) => {
      let column = this._data.map(line => line[i]);
      cb(column, i);
    });
  }

  eachCell(cb) {
    Utils.nTimes(this._data.length, (lineI) => {
      Utils.nTimes(this._data[lineI].length, (columnI) => {
        let cell = this._data[lineI][columnI];
        cb(cell, lineI, columnI);
      });
    });
  }

  getNeighbours(rowI, columnI, diagonals = false) {
    let neighbours = [];

    let notInFirstColumn = rowI > 0;
    let notOnFirstRow = columnI > 0;
    let notInLastColumn = rowI < this._rowLength - 1;
    let notOnLastRow = columnI < this._data.length - 1;

    // top row
    if (diagonals && notOnFirstRow && notInFirstColumn) neighbours.push([rowI - 1, columnI - 1]);
    if (notOnFirstRow) neighbours.push([rowI - 1, columnI]);
    if (diagonals && notOnFirstRow && notInLastColumn) neighbours.push([rowI - 1, columnI + 1]);

    // middle row
    if (notInFirstColumn) neighbours.push([rowI, columnI - 1]);
    if (notInLastColumn) neighbours.push([rowI, columnI + 1]);

    // bottom row
    if (diagonals && notOnLastRow && notInFirstColumn) neighbours.push([rowI + 1, columnI - 1]);
    if (notOnLastRow) neighbours.push([rowI + 1, columnI]);
    if (diagonals && notOnLastRow && notInLastColumn) neighbours.push([rowI + 1, columnI + 1]);

    return neighbours;
  }
}

module.exports = Grid2d;
