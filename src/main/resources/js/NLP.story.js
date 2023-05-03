// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'
const TRAIN_PATH ="src/main/resources/train/Store"
const TEST_PATH = "src/main/resources/train/Store"
const MOVIE = false
let trainData = []
let testData = []

function preparePlayground(movie) {
  startSession(URL)
  changeStopSequence('/*\n//region\n//Requirement') //\n\n\n\n
  changeModel('text-davinci-003\n')
  changeMaxTokens('1300')
  changeTemperature('0')
  topP('1')
  frequencyPenalty('0.2')
  presencePenalty('0')
  // changeLanguage('JavaScript\n')
}

/**
 * @param dataOneOrTwo 1 for the data.js configuration(for back support), 2 for the data2.js configuration(new implementation)
 */
function loadData(dataOneOrTwo) {
  if (dataOneOrTwo === 1) {
    trainData = prepareData(TRAIN_PATH, '.js')
    testData = prepareData(TEST_PATH, '.txt')

  }
    else if (dataOneOrTwo === 2) {
    trainData = getGivenSnippets(prepareData(TRAIN_PATH)).map(sample => formatSnippetWithRegions(sample));
    testData = getUnGivenSnippets(prepareData(TEST_PATH)).map(sample => formatSnippetWithRegions(sample));
  }
}

function train(movie) {
  if (movie) {
    for (let i = 0; i < trainData.length; i++) {
      if (i < 2) {
        writeInstructions(trainData[i].requirement, 80)
        writeInstructions(trainData[i].code, 80)
      } else {
        pasteInstructions(trainData[i].requirement + trainData[i].code + '\n')
      }
    }
  } else {
    pasteInstructions(
      trainData.map(sample => sample.requirement + sample.code + '\n').join(''))
  }
  // writeInstructions('\n\n/* Till here - training\n')
  // submit()
}

function test() {
  for (let i = 0; i < testData.length; i++) {
    writeInstructions('\n' + testData[i].requirement, 60)
    submit()
  }
}

bthread('train', function () {
  loadData(2)
  //print(trainData) using bp.log.info(trainData)

  preparePlayground(MOVIE)
  train(MOVIE)
  test()
})
