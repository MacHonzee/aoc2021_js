const string = `ma-start
YZ-rv
MP-rv
vc-MP
QD-kj
rv-kj
ma-rv
YZ-zd
UB-rv
MP-xe
start-MP
zd-end
ma-UB
ma-MP
UB-xe
end-UB
ju-MP
ma-xe
zd-UB
start-xe
YZ-end`;

module.exports = string.split("\n").map(line => line.split("-"));
