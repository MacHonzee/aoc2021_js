const caves = require("../inputs/day12");

// part one
const caveMap = {};
const smalls = {};
const bigs = {};

function addToSizeMap(path) {
  if (path !== "start" && path !== "end") {
    if (path.match(/[a-z]/)) {
      smalls[path] = true;
    } else {
      bigs[path] = true;
    }
  }
}

function addToCaveMap(start, end) {
  if (start !== "end" && end !== "start") {
    caveMap[start] = caveMap[start] || [];
    caveMap[start].push(end);
  }
}

caves.forEach(path => {
  addToSizeMap(path[0]);
  addToSizeMap(path[1]);
  addToCaveMap(path[0], path[1]);
  addToCaveMap(path[1], path[0]);
});

function explorePaths(route, cave, allowSmallCaveTwice) {
  let hasEnd = false;
  for (let nextCave of caveMap[cave]) {

    // check if we can add small cave to path
    let isTwice = route.alreadyTwice;
    if (smalls[nextCave]) {
      let firstIndex = route.paths.indexOf(nextCave);
      if (firstIndex > -1) {
        if (!allowSmallCaveTwice) {
          hasEnd = false;
          continue;

        } else {
          if (route.alreadyTwice) {
            hasEnd = false;
            continue;

          } else {
            isTwice = nextCave;
          }
        }
      }
    }

    let newRoute = { alreadyTwice: isTwice, paths: [...route.paths] };
    newRoute.paths.push(nextCave);

    if (nextCave === "end") {
      paths.push(newRoute.paths.join("-"));
      hasEnd = true;
      continue;
    }

    let reachesEnd = explorePaths(newRoute, nextCave, allowSmallCaveTwice);
    if (!hasEnd && !reachesEnd) {
      hasEnd = false;
    }
  }

  return hasEnd;
}

const paths = [];
// explorePaths({ alreadyTwice: false, paths: ["start"] }, "start");
// console.log(paths.length);

// part two
// paths.splice(0, paths.length);
explorePaths({ alreadyTwice: false, paths: ["start"] }, "start", true);
console.log(paths.length);

