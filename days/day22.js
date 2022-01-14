// noinspection JSSuspiciousNameCombination

const { cuboids } = require("../inputs/day22");
const Utils = require("../utils/utils");

const RANGE_LIMITS = [-50, 50];

// this was necessary for debugging to see if there were any calculation errors and if the algorithm
// was generating more collisions than there should be
const SKIP_COLLISION_CHECK = true;

function solvePartOne(cuboids, checkRange) {
  const rebootMap = {};

  for (let cuboid of cuboids) {
    let boolValue = cuboid.value === "on";

    let {x, y, z} = cuboid.coordsMap;
    if (checkRange) {
      if (z.from < RANGE_LIMITS[0] || z.from > RANGE_LIMITS[1] || z.to < RANGE_LIMITS[0] || z.to > RANGE_LIMITS[1]) continue;
      if (y.from < RANGE_LIMITS[0] || y.from > RANGE_LIMITS[1] || y.to < RANGE_LIMITS[0] || y.to > RANGE_LIMITS[1]) continue;
      if (x.from < RANGE_LIMITS[0] || x.from > RANGE_LIMITS[1] || x.to < RANGE_LIMITS[0] || x.to > RANGE_LIMITS[1]) continue;
    }

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

  console.log("-> partOne", Object.keys(rebootMap).length);
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

function getCuboidKey(cuboid) {
  let {x, y, z} = cuboid.coordsMap;
  return `${cuboid.value} ${x.from}..${x.to},${y.from}..${y.to},${z.from}..${z.to}`;
}

function getCollisionTree(cuboids) {
  let allCollisions = {};
  let noCollisions = [];

  for (let i = 0; i < cuboids.length; i++) {
    let cuboidA = cuboids[i];
    let {x: xA, y: yA, z: zA} = cuboidA.coordsMap;
    let keyA = getCuboidKey(cuboidA);

    let hasCollision = false;
    for (let y = i + 1; y < cuboids.length; y++) {
      let cuboidB = cuboids[y];
      let {x: xB, y: yB, z: zB} = cuboidB.coordsMap;

      if (subtractLines(xA, xB) && subtractLines(yA, yB) && subtractLines(zA, zB)) {
        hasCollision = true;
        allCollisions[keyA] = allCollisions[keyA] || { cuboid: cuboidA, collisions: [] };
        allCollisions[keyA].collisions.push(cuboidB);
      }
    }

    if (!hasCollision) {
      noCollisions.push(cuboidA);
    }

    if (SKIP_COLLISION_CHECK) break;
  }

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
  // we always remove the collidingCuboid, because it is either replaced by newCuboid completely
  // or broken into new smaller pieces
  universe.splice(universe.indexOf(collidingCuboid), 1);

  // then add the rest of the cuboids that have been created by breaking collidingCuboid into smaller pieces
  // the "collision" cuboid is always ignored, because it is part of newCuboid (and we do not care about value of
  // newCuboid this way, either way it is ignored)
  let { cuboidsAfterSplit } = splitCuboidByCuboid(newCuboid, collidingCuboid);
  universe = universe.concat(cuboidsAfterSplit);

  return universe;
}

function inside(point, line) {
  return point >= line.from && point <= line.to;
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

  cuboidsAfterSplit = mergeCuboids(cuboidsAfterSplit);

  return { collisionCuboid, cuboidsAfterSplit };
}

function samePlane(planeA, planeB) {
  return planeA.from === planeB.from && planeA.to === planeB.to;
}

function neighbourPlanes(planeA, planeB) {
  return (Math.abs(planeB.from - planeA.to) === 1) || (Math.abs(planeA.from - planeB.to) === 1);
}

function mergeCuboids(cuboids) {
  let cuboidList = [];
  cuboids.forEach((cuboid, i) => {

    let cuboidsToDelete = [];
    for (let y = i + 1; y < cuboids.length; y++) {
      let mergedCuboid = cuboids[y];

      let {x: xA, y: yA, z: zA} = cuboid.coordsMap;
      let {x: xB, y: yB, z: zB} = mergedCuboid.coordsMap;

      let samePlaneX = samePlane(xA, xB);
      let samePlaneY = samePlane(yA, yB);
      let samePlaneZ = samePlane(zA, zB);

      if (samePlaneX && samePlaneY && neighbourPlanes(zA, zB)) {
        cuboidsToDelete.push(mergedCuboid);
        cuboid.coordsMap.z = { from: Math.min(zA.from, zB.from), to: Math.max(zA.to, zB.to) };
      }

      if (samePlaneX && samePlaneZ && neighbourPlanes(yA, yB)) {
        cuboidsToDelete.push(mergedCuboid);
        cuboid.coordsMap.y = { from: Math.min(yA.from, yB.from), to: Math.max(yA.to, yB.to) };
      }

      if (samePlaneY && samePlaneZ && neighbourPlanes(xA, xB)) {
        cuboidsToDelete.push(mergedCuboid);
        cuboid.coordsMap.x = { from: Math.min(xA.from, xB.from), to: Math.max(xA.to, xB.to) };
      }
    }

    cuboidsToDelete.forEach(deletedCuboid => {
      cuboids.splice(cuboids.indexOf(deletedCuboid), 1);
    });

    cuboidList.push(cuboid);
  });

  return cuboidList;
}

function getCuboidVolume(cuboid) {
  let {x, y, z} = cuboid.coordsMap;
  return ((x.to - x.from + 1) *  (y.to - y.from + 1) *  (z.to - z.from + 1));
}

function countVolume(universe) {
  return universe.reduce((sum, cuboid) => sum + getCuboidVolume(cuboid), 0);
}

function solvePartTwo(cuboids) {
  let universe = [];

  for (let cuboid of cuboids) {
    console.log(cuboids.indexOf(cuboid));

    // add cuboid to beginning
    universe.unshift(cuboid);
    let key = getCuboidKey(cuboid);

    // get all current collisions, there should be collisions only with the added cuboid
    let currentCollisions = getCurrentCollisions(universe, key);

    // we can freely remove "off" cuboid in case it does not collide with any other (it does not turn off anything)
    if (!currentCollisions && cuboid.value === "off") {
      universe.shift();
      continue;
    }

    // process all of the collisions
    while (currentCollisions) {
      // we have to check collisions multiple times, because if we have two collisions, splitting the root cuboid might
      // interact with the second colision and even add another colliding cuboids
      universe = processCuboidCollision(universe, cuboid, currentCollisions.collisions[0]);

      currentCollisions = getCurrentCollisions(universe, key);
    }

    if (cuboid.value === "off") {
      universe.shift();
    }

    universe = mergeCuboids(universe);
  }

  console.log("cuboidCount", universe.length);

  return countVolume(universe);
}

let volume = solvePartTwo(cuboids);
console.log("-> partTwo", volume);

// let cuboidA = { value: "on", coordsMap: { x: { from: 5, to: 10 }, y: { from: 5, to: 10 }, z: { from: 5, to: 10 }}};
// let cuboidB = { value: "on", coordsMap: { x: { from: 7, to: 8 }, y: { from: 7, to: 8 }, z: { from: 7, to: 8 }}};
//
// let data = splitCuboidByCuboid(cuboidB, cuboidA);
// console.log(data);
