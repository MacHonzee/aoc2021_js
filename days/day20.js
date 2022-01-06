const { algorithm, image } = require("../inputs/day20");

const ENHANCEMENTS = 50;
const HOW_MUCH_PADDING = 1;

function drawImage(image) {
  for (let line of image) {
    console.log(line.map(char => char === "0" ? "." : "#").join(""));
  }
}

function getZeroFill (image, defaultValue) {
  return new Array(image[0].length + 2 * HOW_MUCH_PADDING).fill(defaultValue);
}

function addImgPadding(image, defaultValue) {
  let imgCopy = [];
  for (let i = 1; i <= HOW_MUCH_PADDING; i++) {
    imgCopy.push(getZeroFill(image, defaultValue));
  }

  for (let i = 0; i < image.length; i++) {
    imgCopy.push([...new Array(HOW_MUCH_PADDING).fill(defaultValue), ...image[i], ...new Array(HOW_MUCH_PADDING).fill(defaultValue)]);
  }

  for (let i = 1; i <= HOW_MUCH_PADDING; i++) {
    imgCopy.push(getZeroFill(image, defaultValue));
  }

  return imgCopy;
}

function enhanceImage(image, stepCount) {
  let defaultValue = "0";
  if (algorithm[0] === "#" && stepCount % 2 === 1) defaultValue = "1";

  // first create copied image with added padding - 2 on each side, so that third line or column contains at least one original pixel
  let imgCopy = addImgPadding(image, defaultValue);

  // then go through every pixel in original image + all of its neighbours
  for (let lineI = -1; lineI <= image.length; lineI++) {
    for (let charI = -1; charI <= image[0].length; charI++) {
      // get surrounding index values
      let binaryChars = [];
      for (let i = -1; i <= 1; i++) {
        for (let y = -1; y <= 1; y++) {
          let line = image[lineI + i] || [];
          let char = line[charI + y] || defaultValue;
          binaryChars.push(char);
        }
      }

      // map it to algorithm and replace it by new pixel
      let algPosition = parseInt(binaryChars.join(""), 2);
      imgCopy[lineI + HOW_MUCH_PADDING][charI + HOW_MUCH_PADDING] = algorithm[algPosition] === "#" ? "1" : "0";
    }
  }

  return imgCopy;
}

function solvePartOne() {
  let i = 0;
  let currentImage = image;
  while (i < ENHANCEMENTS) {
    drawImage(currentImage);
    console.log("\n\n");
    currentImage = enhanceImage(currentImage, i);
    i++;
  }

  drawImage(currentImage);
  let lightsCount = currentImage.reduce((sum, line) => sum + line.filter(char => char === "1").length, 0);
  console.log(lightsCount);
}

solvePartOne(); // ENHANCEMENTS = 2 for part one, ENHANCEMENTS = 50 for part two
