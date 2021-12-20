const string = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const [start, patterns] = string.split("\n\n");

let map = patterns.split("\n").reduce((map, line) => {
    let [from, to] = line.split(" -> ");
    map[from] = to;
    return map;
}, {});

module.exports = { start, map };
