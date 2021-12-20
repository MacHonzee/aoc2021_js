const {numbers, boards} = require("../inputs/day4");

// part 1
let boardsCopy = JSON.parse(JSON.stringify(boards));
function checkFilledBoard(board) {
  let filled = false;
  for (let line of board) {
    if (line.every(int => int == null)) return true;
  }

  for (let i = 0; i <= 4; i++) {
    let empty = true;
    for (let y = 0; y <= 4; y++) {
      if (board[y][i] != null) {
        empty = false;
        break;
      }
    }
    if (empty) return true;
  }

  return filled;
}

function findWinningBoard(boards, onlyLast) {
  let winningNum;
  let currentI = 0;
  for (let num of numbers) {
    for (let board of boards) {
      if (!board) continue;

      let foundNum = false;
      for (let line of board) {
        let i = line.findIndex(lineNum => lineNum === num);
        if (i !== -1) {
          winningNum = line[i];
          line[i] = null;
          foundNum = true;
        }
      }

      if (foundNum) {
        let filled = checkFilledBoard(board);
        if (filled) {
          if (onlyLast) {
            let boardI = boards.indexOf(board);
            boards[boardI] = null;
            if (boards.filter(boardIn => boardIn).length === 1) {
              let finalBoard = boards.find(boardIn => boardIn)

              let finalWinningNum;
              for (let i = currentI; i < numbers.length; i++) {
                let innerNum = numbers[i];

                let foundNum = false;
                for (let line of finalBoard) {
                  let i = line.findIndex(lineNum => lineNum === innerNum);
                  if (i !== -1) {
                    winningNum = line[i];
                    line[i] = null;
                    foundNum = true;
                  }
                }

                let filled = checkFilledBoard(finalBoard);
                if (filled) {
                  finalWinningNum = innerNum;
                  break;
                }
              }

              return { board: finalBoard, winningNum: finalWinningNum };
            }
          } else {
            return { board, winningNum };
          }
        }
      }
    }

    currentI++;
  }
}

let { board: winnerBoard, winningNum } = findWinningBoard(boardsCopy);
let winnerBoardSum = winnerBoard.reduce((sum, line) => sum += line.reduce((lineSum, num) => lineSum += (num || 0), 0), 0);
console.log(39902 === winnerBoardSum * winningNum);

// part 2
let secondCopy = JSON.parse(JSON.stringify(boards));
let { board: winnerBoard2, winningNum: winningNum2 } = findWinningBoard(secondCopy, true);
let winnerBoardSum2 = winnerBoard2.reduce((sum, line) => sum += line.reduce((lineSum, num) => lineSum += (num || 0), 0), 0);
console.log(winnerBoardSum2 * winningNum2);
