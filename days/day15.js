const chalk = require("chalk");
const map = require("../inputs/day15");
const Heap = require("heap");

function calculatePath(grid) {
  const MAX_X = grid[0].length - 1;
  const MAX_Y = grid.length - 1;
  const RISK_MAP = grid.reduce((final, line, y) => {
    line.forEach((risk, x) => {
      final[`${x},${y}`] = risk;
    });
    return final;
  }, {});

  function drawPath(grid, path) {
    grid.forEach((line, y) => {
      let str = "";
      line.forEach((risk, x) => {
        if (path.has([x, y].join(","))) {
          str += chalk.red(risk);
        } else {
          str += risk;
        }
      });
      console.log(str);
    });
    console.log("\n");
  }

  function estimateEnd(coords) {
    let [x, y] = coords.split(",").map(Number);
    return 1234;
    // return MAX_X - x + MAX_Y - y; // TODO I don't understand this shit at all, why does it work properly if number is constant
    // and I get different value when number is dynamic?
  }

  function getNeighbors(position) {
    let [x, y] = position.split(",").map(Number);
    let neighbors = [];

    if (x < MAX_X) {
      neighbors.push([x + 1, y]);
    }
    if (x > 0) {
      neighbors.push([x - 1, y]);
    }
    if (y < MAX_Y) {
      neighbors.push([x, y + 1]);
    }
    if (y > 0) {
      neighbors.push([x, y - 1]);
    }

    return { neighbors, neighborStrings: neighbors.map(coord => coord.join(",")) };
  }

  function reconstructPath(cameFrom, current) {
    let totalPath = [{ coords: current, risk: RISK_MAP[current] }];
    while (current in cameFrom) {
      current = cameFrom[current];
      totalPath.unshift({ coords: current, risk: RISK_MAP[current] });
    }
    return totalPath;
  }

  function aStar(start, end, grid) {

    let openSet = new Heap((a, b) => a.fScore - b.fScore);
    openSet.push({ coords: start, fScore: 0 });
    let openPaths = new Set([start]);

    let cameFrom = {};

    let gScore = {};
    gScore[start] = 0;

    let fScore = {};
    fScore[start] = 0;

    while (!openSet.empty()) {
      let current = openSet.pop();
      openPaths.delete(current.coords);

      if (current.coords === end) {
        return reconstructPath(cameFrom, current.coords); // TODO  reconstructPath
      }

      let { neighbors, neighborStrings } = getNeighbors(current.coords);
      neighbors.forEach((neighbor, i) => {
        let neighborStr = neighborStrings[i];
        if (cameFrom[neighborStr] || neighborStr === START) return;

        gScore[neighborStr] = gScore[neighborStr] || Infinity;

        let tentative_gScore = gScore[current.coords] + grid[neighbor[1]][neighbor[0]];
        if (tentative_gScore < gScore[neighborStr]) {
          cameFrom[neighborStr] = current.coords;
          gScore[neighborStr] = tentative_gScore;
          fScore[neighborStr] = tentative_gScore + estimateEnd(neighborStr);

          if (!openPaths.has(neighborStr)) {
            openSet.push({ coords: neighborStr, fScore: fScore[neighborStr] });
            openPaths.add(neighborStr);
          }
        }
      });
    }

    throw "No path to end was found!";
  }

  const START = "0,0";
  const GOAL = `${MAX_X},${MAX_Y}`;

  let finalPath = aStar(START, GOAL, grid);
  let route = new Set(finalPath.map(path => path.coords));
  drawPath(grid, route);
  let finalRisk = finalPath.reduce((sum, path) => sum + path.risk, 0) - grid[0][0];

  console.log(finalRisk);
}

// part one
// calculatePath(map);

// part two
let biggerMap = [];
map.forEach((line, y) => {
  line.forEach((risk, x) => {
    for (let yPlus = 0; yPlus <= 4; yPlus++) {
      for (let xPlus = 0; xPlus <= 4; xPlus++) {
        let newRisk = risk + xPlus + yPlus;
        if (newRisk > 9) {
          newRisk = newRisk % 9;
        }

        biggerMap[y + (map.length * yPlus)] = biggerMap[y + (map.length * yPlus)] || [];
        biggerMap[y + (map.length * yPlus)][x + (line.length * xPlus)] = newRisk;
      }
    }
  });
});

// 527 je too low, 3402 je too high
calculatePath(biggerMap);
