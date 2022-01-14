const instructions = require("../inputs/day24");
const Utils = require("../utils/utils");

class ModelNumber {
  constructor (start) {
    this._str = start.toString();
    this._index = 0;
  }

  getNext() {
    let char = this._str[this._index];
    this._index++;
    return char;
  }
}

function processInstruction(instruction, variables, modelNumber) {
  let [operation, varName, param] = instruction;

  if (param) {
    if (param.match(/[wxyz]/)) {
      param = variables[param];
    } else {
      param = parseInt(param);
    }
  }

  switch (operation) {
  case "inp":
    variables[varName] = modelNumber.getNext();
    break;
  case "add":
    variables[varName] += param;
    break;
  case "mul":
    variables[varName] *= param;
    break;
  case "div":
    variables[varName] = Math.floor(variables[varName] / param);
    break;
  case "mod":
    variables[varName] = variables[varName] % param;
    break;
  case "eql":
    variables[varName] = variables[varName] === param ? 1 : 0;
    break;
  }

  return variables;
}

function setCharAt(str, index, chr) {
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function solvePartOne(instructions) {
  let currentMax = "99999999999999";
  let checkedIndex = currentMax.length - 1;

  Utils.nTimes(14, () => {
    let zValues = [];

    for (let i = 9; i >= 1; i--) {
      let variables = {
        w: 0,
        x: 0,
        y: 0,
        z: 0
      };

      currentMax = setCharAt(currentMax, checkedIndex, i);
      let modelNumber = new ModelNumber(currentMax);

      for (let instr of instructions) {
        variables = processInstruction(instr, variables, modelNumber);
      }

      zValues.unshift(variables.z);
    }

    let min = Math.min(...zValues);
    console.log("-> min", min);
    let rightI = zValues.lastIndexOf(min) + 1;
    console.log(rightI);

    console.log("-> currentMax", currentMax);
    currentMax = setCharAt(currentMax, checkedIndex, rightI);
    checkedIndex--;
  });

  console.log(currentMax);
}

solvePartOne(instructions);
