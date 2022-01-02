const input = require("../inputs/day18");

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

let rootPair = new Pair(input[0], input[1], null, 0);

function explodePair(pair) {
  // find out what was the initial index in structure
  let parent = pair.parent;
  let parentCoord = parent.children.x === pair ? "x" : "y";

  // find closest left neighbour and add the original number
  // FIXME nope not like this
  let currentPair = pair.parent;
  while (currentPair) {
    if (typeof currentPair.x === "number") {
      currentPair.x += pair.x;
      break;
    } else if (typeof currentPair.y === "number") {
      currentPair.y += pair.y;
      break;
    } else {
      currentPair = currentPair.parent;
    }
  }

  // replace pair by 0 and fix the children reference of parent
  delete parent.children[parentCoord];
  parent[parentCoord] = 0;
}

function splitPair(pair) {}

function reducePair(pair) {
  if (pair.nesting >= 4) { // TODO maybe check pair.children first
    explodePair(pair);
  }

  if (pair.x > 9 || pair.y > 10) {
    splitPair(pair);
  }

  if (pair.children) {
    pair.children.x && reducePair(pair.children.x);
    pair.children.y && reducePair(pair.children.y);
  }
}

reducePair(rootPair);
console.log("-> rootPair", rootPair);
