const string = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

let chars = [...string.matchAll(/[A-D]/g)];
module.exports = {
  hall: new Array(11).fill(false),
  slots: [
    [chars[0][0], chars[4][0]],
    [chars[1][0], chars[5][0]],
    [chars[2][0], chars[6][0]],
    [chars[3][0], chars[7][0]],
  ]
};

