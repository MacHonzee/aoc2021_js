// noinspection JSSuspiciousNameCombination

const { cuboids, parseCuboidString } = require("../inputs/day22");
const Utils = require("../utils");

const RANGE_LIMITS = [-50, 50];

function solvePartOne(cuboids, checkRange) {
  const rebootMap = {};

  let partOneIterations = 0;

  for (let cuboid of cuboids) {
    let boolValue = cuboid.value === "on";

    let {x, y, z} = cuboid.coordsMap;
    if (checkRange) {
      if (z.from < RANGE_LIMITS[0] || z.from > RANGE_LIMITS[1] || z.to < RANGE_LIMITS[0] || z.to > RANGE_LIMITS[1]) continue;
      if (y.from < RANGE_LIMITS[0] || y.from > RANGE_LIMITS[1] || y.to < RANGE_LIMITS[0] || y.to > RANGE_LIMITS[1]) continue;
      if (x.from < RANGE_LIMITS[0] || x.from > RANGE_LIMITS[1] || x.to < RANGE_LIMITS[0] || x.to > RANGE_LIMITS[1]) continue;
    }

    partOneIterations += countIterations(cuboid);

    Utils.rangeTimes(z.from, z.to, (z) => {
      Utils.rangeTimes(y.from, y.to, (y) => {
        Utils.rangeTimes(x.from, x.to, (x) => {
          if (boolValue) {
            rebootMap[`${x},${y},${z}`] = boolValue;
          } else {
            delete rebootMap[`${x},${y},${z}`];
          }
        });
      });
    });
  }

  console.log("-> partOneIterations", partOneIterations);
  console.log(Object.keys(rebootMap).length);
}

solvePartOne(cuboids, true);

// lineA has precedency over lineB, we have to split lineB always and keep lineA intact
function subtractLines(majorLine, dividedLine) {
  let majorLineStartsInB = inside(majorLine.from, dividedLine);
  let majorLineEndsInB = inside(majorLine.to, dividedLine);
  let dividedLineStartsInA = inside(dividedLine.from, majorLine);
  let dividedLineEndsInA = inside(dividedLine.to, majorLine);

  if (majorLineStartsInB && majorLineEndsInB) {
    let left, right;
    if (majorLine.from !== dividedLine.from) left = { from: dividedLine.from, to: majorLine.from - 1 };
    if (majorLine.to !== dividedLine.to) right = { from: majorLine.to + 1, to: dividedLine.to };
    return { collision: majorLine, left, right };

  } else if (dividedLineStartsInA && dividedLineEndsInA) {
    return { collision: dividedLine };

  } else if (!majorLineStartsInB && majorLineEndsInB) {
    let right = { from: majorLine.to + 1, to: dividedLine.to };
    return { collision: { from: dividedLine.from, to: majorLine.to }, right};

  } else if (majorLineStartsInB && !majorLineEndsInB) {
    let left = { from: dividedLine.from, to: majorLine.from - 1 };
    return { collision: { from: majorLine.from, to: dividedLine.to }, left};

  } else {
    return false;
  }
}

function countIterations(cuboid) {
  let {x, y, z} = cuboid.coordsMap;
  return (x.to - x.from) * (y.to - y.from) * (z.to - z.from);
}

function getCuboidKey(cuboid) {
  let {x, y, z} = cuboid.coordsMap;
  return `${cuboid.value} ${x.from}..${x.to},${y.from}..${y.to},${z.from}..${z.to}`;
}

function getCollisionTree(cuboids) {
  let allCollisions = {};
  let noCollisions = [];

  cuboids.forEach((cuboidA, i) => {
    let {x: xA, y: yA, z: zA} = cuboidA.coordsMap;
    let keyA = getCuboidKey(cuboidA);

    let hasCollision = false;
    cuboids.forEach((cuboidB, y) => {
      if (y <= i) return; // to remove duplicit collisions

      let {x: xB, y: yB, z: zB} = cuboidB.coordsMap;

      if (subtractLines(xA, xB) && subtractLines(yA, yB) && subtractLines(zA, zB)) {
        hasCollision = true;
        allCollisions[keyA] = allCollisions[keyA] || { cuboid: cuboidA, collisions: [] };
        allCollisions[keyA].collisions.push(cuboidB);
      }
    });

    if (!hasCollision) {
      noCollisions.push(cuboidA);
    }
  });

  return { allCollisions, noCollisions };
}

function getCurrentCollisions(universe, key) {
  let { allCollisions } = getCollisionTree(universe);

  // check if we are doing it correct
  let collisionCount = Object.keys(allCollisions).length;
  if (collisionCount > 1) throw "Some calculations is wrong, there should be only one colliding cuboid.";
  if (collisionCount && !allCollisions[key]) throw "The only collision is not the one that we are checking right now.";

  return allCollisions[key];
}

function processCuboidCollision(universe, newCuboid, collidingCuboid) {
  // first we remove original cuboid from universe to make sure that there will be no conflict again,
  // because we might be adding some new cuboids back (and we do not know how many yet in this point)
  universe.shift();

  // TODO it should be possible to refactor this, probably we dont need two different methods,
  // we can probably just remove collidingCuboid, add the newCuboid if it has "on" value and add the leftovers after
  // breaking the collidingCuboid

  // then we do one of two things -> if newCuboid is "on", we add cuboids together, else we subtract them
  if (newCuboid.value === "on") {
    universe = joinCuboids(universe, newCuboid, collidingCuboid);
  } else {
    // collidingCuboid is always "on", because universe contains only non-colliding "on" cuboids
    universe = subtractCuboids(universe, newCuboid, collidingCuboid);
  }

  return universe;
}

// TODO it should be possible to refactor this
function joinCuboids(universe, newCuboid, collidingCuboid) {
  // now we check how much they collide
  if (includesCuboidWithin(newCuboid, collidingCuboid)) {
    universe.unshift(newCuboid);
    universe.splice(universe.indexOf(collidingCuboid), 1);
  } else if (includesCuboidWithin(collidingCuboid, newCuboid)) {
    // nothing, its ok, because newCuboid is not in universe now and collidingCuboid still is,
    // and since it is on + on cuboid values, we can just keep the old collidingCuboid and go on
    return universe;
  } else {
    // there is a partial overlap -> we split newCuboid to smaller parts then
    let { cuboidsAfterSplit } = splitCuboidByCuboid(newCuboid, collidingCuboid);

    // we add newCuboid (which has "on" value), ignore the created collisionCuboid and add all cuboidsAfterSplit
    universe.unshift(newCuboid);
    universe.splice(universe.indexOf(collidingCuboid), 1);
    universe = universe.concat(cuboidsAfterSplit);
  }

  return universe;
}

function inside(point, line) {
  return point >= line.from && point <= line.to;
}

function includesCuboidWithin(biggerCuboid, smallerCuboid) {
  let { x: bigX, y: bigY, z: bigZ } = biggerCuboid.coordsMap;
  let { x: smallX, y: smallY, z: smallZ } = smallerCuboid.coordsMap;

  return bigX.from <= smallX.from && bigX.to >= smallX.to &&
    bigY.from <= smallY.from && bigY.to >= smallY.to &&
    bigZ.from <= smallZ.from && bigZ.to >= smallZ.to;
}

const AXISES = ["left", "collision", "right"];
function eachAxis(cb) {
  for (let axis of AXISES) {
    cb(axis);
  }
}

// this is the 3d magic, because we split cuboids by another cuboid
function splitCuboidByCuboid(newCuboid, collidingCuboid) {
  let {x: xA, y: yA, z: zA} = newCuboid.coordsMap;
  let {x: xB, y: yB, z: zB} = collidingCuboid.coordsMap;

  let [collisionX, collisionY, collisionZ] = [subtractLines(xA, xB), subtractLines(yA, yB), subtractLines(zA, zB)];

  // this is the intersecting cuboid, it will be pretty much always ignored -> if we add on + on cuboids together,
  // then we can just keep whole newCuboid instead and split the collidingCuboid
  // and if we add off + on cuboids together, then we just split the collidingCuboid
  let collisionCuboid = { value: "collision", coordsMap: { x: collisionX.collision, y: collisionY.collision, z: collisionZ.collision }};

  // and here we have cuboids that are created after breaking collidingCuboid by intersecting with newCuboid
  // it can range from 1 to 26 new cuboids if we split it by each possible axis and all their combinations (3 * 3 * 3 - 1)

  let cuboidsAfterSplit = [];
  eachAxis(xAxis => {
    if (!collisionX[xAxis]) return;

    eachAxis(yAxis => {
      if (!collisionY[yAxis]) return;

      eachAxis(zAxis => {
        if (!collisionZ[zAxis]) return;

        if ([xAxis, yAxis, zAxis].every(axis => axis === "collision")) return;

        cuboidsAfterSplit.push({ value: "on", coordsMap: { x: collisionX[xAxis], y: collisionY[yAxis], z: collisionZ[zAxis] } });
      });
    });
  });

  return { collisionCuboid, cuboidsAfterSplit };
}

// here, newCuboid has "off" value, so we are killing some of the collidingCuboids
function subtractCuboids(universe, newCuboid, collidingCuboid) {
  // it does not matter if one cuboid contains another, we always need to remove the collidingCuboid
  universe.splice(universe.indexOf(collidingCuboid), 1);

  // then add the rest of the cuboids that have been created
  let { cuboidsAfterSplit } = splitCuboidByCuboid(newCuboid, collidingCuboid);
  universe = universe.concat(cuboidsAfterSplit);

  return universe;
}

function solvePartTwo(cuboids) {
  let universe = [];

  for (let cuboid of cuboids) {
    // add cuboid to beginning
    universe.unshift(cuboid);
    let key = getCuboidKey(cuboid);

    // get all current collisions
    let currentCollisions = getCurrentCollisions(universe, key);

    // we can freely remove "off" cuboid in case it does not collide with any other (it does not turn off anything)
    if (!currentCollisions && cuboid.value === "off") {
      universe.shift();
      continue;
    }

    while (currentCollisions) {
      // we have to check collisions multiple times, because if we have two collisions, splitting the root cuboid might
      // interact with the second colision and even add another colliding cuboids
      universe = processCuboidCollision(universe, cuboid, currentCollisions[0]);

      currentCollisions = getCurrentCollisions(universe, key);
    }
  }
}

// solvePartTwo(cuboids);

let cuboidA = { value: "on", coordsMap: { x: { from: 6, to: 8 }, y: { from: 6, to: 8 }, z: { from: 6, to: 8 }}};
let cuboidB = { value: "on", coordsMap: { x: { from: 5, to: 10 }, y: { from: 5, to: 10 }, z: { from: 5, to: 10 }}};

let { collisionCuboid, cuboidsAfterSplit } = splitCuboidByCuboid(cuboidA, cuboidB);
console.log(collisionCuboid);
console.log(cuboidsAfterSplit);
