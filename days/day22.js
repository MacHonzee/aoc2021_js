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

function collision(lineA, lineB) {
  let lineAfromInB = inside(lineA.from, lineB);
  let lineAtoInB = inside(lineA.to, lineB);
  let lineBfromInA = inside(lineB.from, lineA);
  let lineBtoInA = inside(lineB.to, lineA);

  if (lineAfromInB && lineAtoInB) {
    return lineA;
  } else if (lineBfromInA && lineBtoInA) {
    return lineB;
  } else if (!lineAfromInB && lineAtoInB) {
    return { from: lineB.from, to: lineA.to };
  } else if (lineAfromInB && !lineAtoInB) {
    return { from: lineA.from, to: lineB.to };
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

      if (collision(xA, xB) && collision(yA, yB) && collision(zA, zB)) {
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
  if (collisionCount > 1) throw "Some calculations is wrong, there should be only one collision.";
  if (collisionCount && !allCollisions[key]) throw "The only collision is not the one that we are checking right now.";

  return allCollisions[key];
}

function processCuboidCollision(universe, cuboidA, cuboidB) {
  // first we remove original cuboid from universe to make sure that there will be no conflict again,
  // because we might be adding some new cuboids back (and we do not know how many yet in this point)
  universe.shift();

  // then we do one of two things -> if cuboidA and cuboidB are "on", we add cuboids together, else we subtract them
  if (cuboidA.value === "on" && cuboidB.value === "on") {
    universe = joinCuboids(universe, cuboidA, cuboidB);
  } else {
    // cuboidB is always "on", because universe contains only non-colliding "on" cuboids
    universe = subtractCuboids(universe, cuboidA, cuboidB);
  }

  return universe;
}

function joinCuboids(universe, cuboidA, cuboidB) {
  // now we check how much they collide
  if (includesCuboidWithin(cuboidA, cuboidB)) {
    universe.unshift(cuboidA);
    universe.splice(universe.indexOf(cuboidB), 1);
  } else if (includesCuboidWithin(cuboidB, cuboidA)) {
    // nothing, its ok, because cuboidA is not in universe now and cuboidB still is
    return universe;
  } else {
    // TODO
    // there is a partial overlap -> we split cuboidA to smaller parts then
    splitCuboidByCuboid(cuboidA, cuboidB);
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

// this is the bullshit 3d magic, because we have to (sry for Czech):
// rozdělujeme cuboid A podle všech ploch cuboidu B, kde máme 3 varianty
// a) dotýkají se pouze přes roh, takže mají navzájem jeden vrchol uvnitř druhého cuboidu,
//    tzn. z cuboidu A se stanou 3 cuboidi + 1 colliding cuboid
// b) dotýkají se přes celou hranu, takže jeden má 2 vrcholy uvnitř druhého
//    tzn. z cuboidu A se stanou 4 cuboidu + 1 colliding cuboid
// c) dotýkají se přes celou jednu stranu, takže jeden má 4 vrcholy uvnitř druhého
//    tzn. z cuboidu U se stanou 5 cuboidů + 1 colliding cuboid
function splitCuboidByCuboid(cuboidA, cuboidB) {
  let {x: xA, y: yA, z: zA} = cuboidA.coordsMap;
  let {x: xB, y: yB, z: zB} = cuboidB.coordsMap;

  let [collisionX, collisionY, collisionZ] = [collision(xA, xB), collision(yA, yB), collision(zA, zB)];
  let collidingCuboid = { value: "collision", coordsMap: { x: collisionX, y: collisionY, z: collisionZ }};

  // TODO now we have to process the cuboid

  return collidingCuboid;
}

function subtractCuboids(universe, cuboidA, cuboidB) {
  // TODO

  return universe;
}

function solvePartTwo(cuboids) {
  let universe = [];

  for (let cuboid of cuboids) {
    universe.unshift(cuboid);
    let key = getCuboidKey(cuboid);

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

let cuboidA = { value: "on", coordsMap: { x: { from: 5, to: 10 }, y: { from: 5, to: 10 }, z: { from: 5, to: 10 }}};
let cuboidB = { value: "on", coordsMap: { x: { from: 2, to: 6 }, y: { from: 2, to: 6 }, z: { from: 2, to: 6 }}};

let collisionCuboid = splitCuboidByCuboid(cuboidB, cuboidA);
console.log(collisionCuboid);
