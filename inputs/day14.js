const string = `BVBNBVPOKVFHBVCSHCFO

SO -> V
PB -> P
HV -> N
VF -> O
KS -> F
BB -> C
SH -> H
SB -> C
FS -> F
PV -> F
BC -> K
SF -> S
NO -> O
SK -> C
PO -> N
VK -> F
FC -> C
VV -> S
SV -> S
HH -> K
FH -> K
HN -> O
NP -> F
PK -> N
VO -> K
NC -> C
KP -> B
CS -> C
KO -> F
BK -> N
OO -> N
CF -> H
KN -> C
BV -> S
OK -> O
CN -> F
OP -> O
VP -> N
OC -> P
NH -> C
VN -> S
VC -> B
NF -> H
FO -> H
CC -> B
KB -> N
CP -> N
HK -> N
FB -> H
BH -> V
BN -> N
KC -> F
CV -> K
SP -> V
VS -> P
KF -> S
CH -> V
NS -> N
HS -> O
CK -> K
NB -> O
OF -> K
VB -> N
PS -> B
KH -> P
BS -> C
VH -> C
KK -> F
FN -> F
BP -> B
HF -> O
HB -> V
OV -> H
NV -> N
HO -> S
OS -> H
SS -> K
BO -> V
OB -> K
HP -> P
CO -> B
PP -> K
HC -> N
BF -> S
NK -> S
ON -> P
PH -> C
FV -> H
CB -> H
PC -> K
FF -> P
PN -> P
NN -> O
PF -> F
SC -> C
FK -> K
SN -> K
KV -> P
FP -> B
OH -> F`;

const [start, patterns] = string.split("\n\n");

let map = patterns.split("\n").reduce((map, line) => {
  let [from, to] = line.split(" -> ");
  map[from] = to;
  return map;
}, {});

module.exports = { start, map };
