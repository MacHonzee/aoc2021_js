const input = require("../inputs/day18");

const VERBOSE = false;

class Pair {
  constructor(x, y, parent, nesting) {
    this.x = x;
    this.y = y;
    this.nesting = nesting;
    if (parent) this.parent = parent;
    this.children = this.constructChildren();
  }

  constructChildren() {
    let children = {};
    let self = this;

    if (Array.isArray(this.x)) {
      children.x = new Pair(this.x[0], this.x[1], self, this.nesting + 1);
    }

    if (Array.isArray(this.y)) {
      children.y = new Pair(this.y[0], this.y[1], self, this.nesting + 1);
    }

    return children;
  }
}

function findNeighbouringNumber(originalPair, targetSide) {
  let parentPair = originalPair.parent;
  let currentPair = originalPair;
  while (parentPair) {
    // if there is a number, we need that pair
    if (typeof parentPair[targetSide] === "number") {
      return { side: targetSide, pair: parentPair };
    } else {
      // otherwise it is an array, so we need to check if it is in a different coord
      let parentCoord = parentPair.children.x === currentPair ? "x" : "y";

      // in case that we need left neighbour (targetSide === x), then we have to see if
      // previous pair is in same coord or not. If not (for example it is currently in Y position),
      // then we need to find top-most number in targetSide of the current pair
      // otherwise we traverse deeper into parent structure
      if (parentCoord === targetSide) {
        currentPair = parentPair;
        parentPair = parentPair.parent;
      } else {
        let oppositeSide = targetSide === "x" ? "y" : "x";
        let topMostPair = findTopMostNumber(parentPair.children[targetSide], oppositeSide);
        return { side: oppositeSide, pair: topMostPair };
      }
    }
  }
}

function findTopMostNumber(pair, targetSide) {
  let currentPair = pair;
  while (currentPair) {
    if (typeof currentPair[targetSide] === "number") {
      return currentPair;
    } else {
      currentPair = currentPair.children[targetSide];
    }
  }
}

function explodePair(pair) {
  // find out what was the initial index in structure
  let parent = pair.parent;
  let parentCoord = parent.children.x === pair ? "x" : "y";

  // find closest left neighbour and add the original number
  let leftPair = findNeighbouringNumber(pair, "x");
  if (leftPair) {
    leftPair.pair[leftPair.side] += pair.x;
  }

  // find closest right neighbour and add the original number
  let rightPair = findNeighbouringNumber(pair, "y");
  if (rightPair) {
    rightPair.pair[rightPair.side] += pair.y;
  }

  // replace pair by 0 and fix the children reference of parent
  delete parent.children[parentCoord];
  parent[parentCoord] = 0;
}

function splitPair(pair, targetSide) {
  let half = pair[targetSide] / 2;
  let newX = Math.floor(half);
  let newY = Math.ceil(half);
  pair[targetSide] = [newX, newY];
  pair.children[targetSide] = new Pair(newX, newY, pair, pair.nesting + 1);
}

function checkAllExplodes(pair) {
  if (!pair.children.x && !pair.children.y && pair.nesting >= 4) {
    explodePair(pair);
    return "exploding";
  }

  if (pair.children && pair.children.x) {
    let exploding = checkAllExplodes(pair.children.x);
    if (exploding) return exploding;
  }

  if (pair.children && pair.children.y) {
    let exploding = checkAllExplodes(pair.children.y);
    if (exploding) return exploding;
  }
}

function checkAllSplits(pair) {
  if (typeof pair.x === "number") {
    if (pair.x > 9) {
      splitPair(pair, "x");
      return "splitting";
    }
  } else {
    let splitting = checkAllSplits(pair.children.x);
    if (splitting) return splitting;
  }

  if (typeof pair.y === "number") {
    if (pair.y > 9) {
      splitPair(pair, "y");
      return "splitting";
    }
  } else {
    let splitting = checkAllSplits(pair.children.y);
    if (splitting) return splitting;
  }
}

function drawPair(pair) {
  let isXnumber = typeof pair.x === "number";
  let isYnumber = typeof pair.y === "number";
  return `[${isXnumber ? pair.x : drawPair(pair.children.x)},${isYnumber ? pair.y : drawPair(pair.children.y)}]`;
}

function addAllLines(input) {
  let targetArray = input[0];
  for (let i = 1; i < input.length; i++) {
    // processing addition to previous line
    targetArray = [targetArray, input[i]];
    let rootPair = new Pair(targetArray[0], targetArray[1], null, 0);
    if (VERBOSE) console.log("-> after addition ", drawPair(rootPair));

    // then we reduce the newly added pair
    let reducing;
    do {
      reducing = checkAllExplodes(rootPair); // all explodes first
      if (!reducing) reducing = checkAllSplits(rootPair); // all splits first
      if (reducing && VERBOSE) console.log("-> after " + reducing, drawPair(rootPair));
    } while (reducing);
    if (VERBOSE) console.log("-> after reducing ", drawPair(rootPair));

    // and create new array for next step out of the result
    targetArray = JSON.parse(drawPair(rootPair));
    if (VERBOSE) console.log();
  }

  let rootPair = new Pair(targetArray[0], targetArray[1], null, 0);
  if (VERBOSE) console.log("-> final result   ", drawPair(rootPair));
  return rootPair;
}

function magnitude(pair) {
  let magnitudeX = typeof pair.x === "number" ? 3 * pair.x : 3 * magnitude(pair.children.x);
  let magnitudeY = typeof pair.y === "number" ? 2 * pair.y : 2 * magnitude(pair.children.y);
  return magnitudeX + magnitudeY;
}

// part one
let finalPair = addAllLines(input);
console.log(magnitude(finalPair));

// part two
function combineToAllPairs(input) {
  let allCombos = {};
  for (let i = 0; i < input.length; i++) {
    for (let y = 0; y < input.length; y++) {
      if (i !== y) {
        allCombos[`${i},${y}`] = 0;
      }
    }
  }
  return allCombos;
}

let allCombos = combineToAllPairs(input);
Object.keys(allCombos).forEach(combo => {
  let [i0, i1] = combo.split(",");
  let lines = [input[i0], input[i1]];
  let pair = addAllLines(lines);
  allCombos[combo] = magnitude(pair);
});

console.log(Math.max(...Object.values(allCombos)));
