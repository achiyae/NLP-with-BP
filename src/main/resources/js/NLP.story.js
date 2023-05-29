// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'
const TRAIN_PATH = 'src/main/resources/projects/Magento'
const TEST_PATH = TRAIN_PATH //can also point to a different directory
const MOVIE = false
let trainData = []
let testData = []

function preparePlayground(movie) {
  startSession(URL)
  changeStopSequence('/*\n//region\n//Requirement:') //\n\n\n\n
  changeModel('text-davinci-003\n')
  changeMaxTokens('1300')
  changeTemperature('0')
  topP('1')
  frequencyPenalty('0.2')
  presencePenalty('0')
  // changeLanguage('JavaScript\n')
}

function loadData() {
  trainData = getTrainSnippets(parseSnippetsFile(TRAIN_PATH, true)).map(sample => formatSnippetWithRegions(sample))
  testData = getTestSnippets(parseSnippetsFile(TEST_PATH)).map(sample => formatSnippetWithRegions(sample))
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
    writeInstructions('\n\n' + testData[i].requirement, 60)
    submit()
  }
}

function exportData() {
  exportSnippets(trainData, TRAIN_PATH)
}

bthread('train', function () {
  loadData()
  //print(trainData) using bp.log.info(trainData)

  preparePlayground(MOVIE)
  train(MOVIE)
  test()
})
