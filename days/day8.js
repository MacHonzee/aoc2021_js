const codes = require("../inputs/day8");

// part 1
const KNOWN_LENGHTS = [2, 3, 4, 7];
let result = codes.reduce((sum, line) => sum + (line[1].filter(code => KNOWN_LENGHTS.includes(code.length)).length), 0);
console.log("-> result", result);

// part 2
const SEGMENTS_MAP = {
  1: [3, 6],
  7: [1, 3, 6],
  4: [2, 3, 4, 6],
  2: [1, 3, 4, 5, 7],
  3: [1, 3, 4, 6, 7],
  5: [1, 2, 4, 6, 7],
  0: [1, 2, 3, 5, 6, 7],
  6: [1, 2, 4, 5, 6, 7],
  9: [1, 2, 3, 4, 6, 7],
  8: [1, 2, 3, 4, 5, 6, 7]
};

// key is length of string, values are the decoded numbers
const SEGMENTS_BY_LENGTH = {
  2: ["1"],
  3: ["7"],
  4: ["4"],
  5: ["2", "3", "5"],
  6: ["0", "6", "9"],
  7: ["8"]
};

let sumOfAll = 0;
for (let line of codes) {
  const charToSegmentMap = {};

  // get list of all codes grouped by their length
  const segmentsByLength = {};
  line[0].forEach(code => {
    let length = code.length.toString();
    segmentsByLength[length] = segmentsByLength[length] || [];
    if (segmentsByLength[length].length <= SEGMENTS_BY_LENGTH[length].length ) {
      segmentsByLength[length].push(code);
    }
  });

  // first map letter of segment 1, because we can make sure from code for "1" and for "7"
  let codeFor1 = segmentsByLength["2"][0];
  let codeFor7 = segmentsByLength["3"][0];
  let charToSegment1 = codeFor7.split("").find(char => codeFor1.indexOf(char) === -1);
  charToSegmentMap[charToSegment1] = "1";

  // then find out letter of segment 7 of number 3, because letters for segments 1, 3, 4 and 6 are set already (from number 1, 4 and 7)
  let codeFor4 = segmentsByLength["4"][0];
  let charToSegment7;
  for (let code of segmentsByLength["5"]) {
    let foundChar = code.split("").find(char => {
      return !charToSegmentMap[char] &&
        codeFor1.indexOf(char) === -1 &&
        codeFor4.indexOf(char) === -1 &&
        segmentsByLength["5"].every(codeB => codeB.indexOf(char) > -1 );
    });
    if (foundChar) {
      charToSegment7 = foundChar;
      break;
    }
  }
  charToSegmentMap[charToSegment7] = "7";

  // now we can guess letter for segment 5, because we know 1, 3, 4, and 7
  let charToSegment5;
  let codeFor2;
  for (let code of segmentsByLength["5"]) {
    let foundChar = code.split("").find(char => !charToSegmentMap[char] && codeFor1.indexOf(char) === -1 && codeFor4.indexOf(char) === -1);
    if (foundChar) {
      charToSegment5 = foundChar;
      codeFor2 = code;
      break;
    }
  }
  charToSegmentMap[charToSegment5] = "5";

  // now we know letters for 1, 5 and 7 for sure, we can get letter for 4 because it is now the only unknown and common
  // for 5-letter long codes
  let charToSegment4;
  for (let code of segmentsByLength["5"]) {
    let foundChar = code.split("").find(char => {
      return !charToSegmentMap[char] && segmentsByLength["5"].every(codeB => codeB.indexOf(char) > -1 );
    });
    if (foundChar) {
      charToSegment4 = foundChar;
      break;
    }
  }
  charToSegmentMap[charToSegment4] = "4";

  // now we can easily get letter for segment 2 from code for number 4
  let charToSegment2 = codeFor4.split("").find(char => !charToSegmentMap[char] && codeFor1.indexOf(char) === -1);
  charToSegmentMap[charToSegment2] = "2";

  // now from known codeFor2 we can derive number 3 easily, because it is the only one unknown
  let charToSegment3 = codeFor2.split("").find(char => !charToSegmentMap[char]);
  charToSegmentMap[charToSegment3] = "3";

  // and the last letter is the same process from codeFor4
  let charToSegment6 = codeFor4.split("").find(char => !charToSegmentMap[char]);
  charToSegmentMap[charToSegment6] = "6";

  // now we can decode the second part of code
  let secondNumbers = line[1].map(code => {
    return code.split("").map(char => charToSegmentMap[char]).sort();
  });

  let decodedNumbers = secondNumbers.map(combo => {
    return Object.keys(SEGMENTS_MAP).find(targetNum => {
      return SEGMENTS_MAP[targetNum].join("") === combo.join("");
    });
  });

  let finalNumber = parseInt(decodedNumbers.join(""));
  sumOfAll += finalNumber;
}

console.log(sumOfAll);
