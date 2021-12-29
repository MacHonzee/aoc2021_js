const hexaString = require("../inputs/day16");

const HEXA_TO_BINARY = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111"
};

function hexaToBinary(str) {
  return str.split("").map(char => HEXA_TO_BINARY[char]).join("");
}

function binaryToDecimal(str) {
  return parseInt(str, 2);
}

function splitValueToParts(string, length) {
  const strings = [];
  const parts = Math.floor(string.length / length);
  for (let i = 0; i < parts; i++) {
    let subpart = string.substr(i * length, length);
    strings.push(subpart);
    if (subpart[0] === "0") break;
  }
  return strings;
}

const LITERAL = "literal";
const OPERATOR = "operator";

function parsePacket(string) {
  const packet = {};
  packet.version = binaryToDecimal(string.substr(0, 3));
  packet.id = binaryToDecimal(string.substr(3, 3));
  packet.type = packet.id === 4 ? LITERAL : OPERATOR;

  if (packet.type === LITERAL) {
    let parts = splitValueToParts(string.substr(6), 5);
    packet.packetStringSize = parts.join("").length + 6;

    let valueStr = parts.map(part => part.substr(1)).join("");
    packet.value = binaryToDecimal(valueStr);
  } else {
    packet.lengthType = parseInt(string.substr(6, 1));

    // subpackets have known length in bits
    if (packet.lengthType === 0) {
      let subpacketsLength = binaryToDecimal(string.substr(7, 15));
      let subpacketsString = string.substr(22, subpacketsLength);
      packet.packetStringSize = 22 + subpacketsLength; // 22 chars already processed + the length of subpackets
      packet.subpacketsLength = 0;
      packet.subpackets = [];

      do {
        let subpacket = parsePacket(subpacketsString);
        packet.subpacketsLength += subpacket.packetStringSize;
        packet.subpackets.push(subpacket);

        subpacketsString = subpacketsString.substr(subpacket.packetStringSize);
      } while (packet.subpacketsLength < subpacketsLength);


    } else {
      // subpackets have known count, unknown length
      packet.expectedSubpacketsCount = binaryToDecimal(string.substr(7, 11));
      let subpacketsString = string.substr(18);
      packet.packetStringSize = 18;
      packet.subpackets = [];
      while (packet.subpackets.length < packet.expectedSubpacketsCount) {
        let subpacket = parsePacket(subpacketsString);
        packet.subpackets.push(subpacket);

        subpacketsString = subpacketsString.substr(subpacket.packetStringSize);
      }

      packet.packetStringSize = 18 + packet.subpackets.reduce((sum, subpacket) => sum + subpacket.packetStringSize, 0);
    }
  }

  return packet;
}

function sumAllAttributes(packets, attribute) {
  let sum = 0;
  packets.forEach(packet => {
    sum += (packet[attribute] || 0);
    if (packet.subpackets) sum += sumAllAttributes(packet.subpackets, attribute);
  });
  return sum;
}

let binaryString = hexaToBinary(hexaString);
let packet = parsePacket(binaryString);
console.log(sumAllAttributes([packet], "version"));

// part two
function processOperators(packet) {
  if (packet.subpackets) {
    packet.subpackets.forEach(processOperators);
  }

  if (packet.id === 0) {
    packet.value = packet.subpackets.reduce((sum, subpacket) => sum + subpacket.value, 0);
  } else if (packet.id === 1) {
    packet.value = packet.subpackets.reduce((product, subpacket) => product * subpacket.value, 1);
  } else if (packet.id === 2) {
    packet.value = Math.min(...packet.subpackets.map(subpacket => subpacket.value));
  } else if (packet.id === 3) {
    packet.value = Math.max(...packet.subpackets.map(subpacket => subpacket.value));
  } else if (packet.id === 5) {
    let isGreater = packet.subpackets[0].value > packet.subpackets[1].value;
    packet.value = isGreater ? 1 : 0;
  } else if (packet.id === 6) {
    let isLesser = packet.subpackets[0].value < packet.subpackets[1].value;
    packet.value = isLesser ? 1 : 0;
  } else if (packet.id === 7) {
    let isEqual = packet.subpackets[0].value === packet.subpackets[1].value;
    packet.value = isEqual ? 1 : 0;
  }
}

processOperators(packet);
console.log("-> result", packet.value);
