//region
//Requirement:
//Output:
function choose(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//endregion