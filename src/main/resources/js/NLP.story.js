// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'
const TRAIN_PATH = "src/main/resources/train/Magento";
const TEST_PATH = "src/main/resources/test/MeetTheBanker";
const MOVIE = false
let trainData = []
let testData = []

function preparePlayground(movie) {
  startSession(URL)
  changeStopSequence('Example:\n/*\n') //\n\n\n\n
  changeModel('text-davinci-003\n')
  changeMaxTokens('1000')
  changeTemperature('0')
  topP('1')
  frequencyPenalty('0.2')
  presencePenalty('0')
  changeLanguage('JavaScript\n')
}

function loadData() {
  trainData = prepareData(TRAIN_PATH, '.js')
  testData = prepareData(TEST_PATH, '.txt')
}

function train(movie) {
  if (movie) {
    for (let i = 0; i < trainData.length; i++) {
      if(i < 2 ) {
        writeInstructions('Example: ' + trainData[i].requirement + '\n', 80)
        writeInstructions('Output:' + trainData[i].code, 80)
      }
      else {
        pasteInstructions('Example: ' + trainData[i].requirement + '\n' + 'Output:' + trainData[i].code)
      }
    }
  } else {
    pasteInstructions(
      trainData.map(sample => 'Example: ' + sample.requirement + '\n' + 'Output:' + sample.code).join(''))
  }
  writeInstructions('\n\n// Till here - training./*')
  submit()
}

function test() {
  for (let i = 0; i < testData.length; i++) {
    writeInstructions('Example: '+testData[i] + '\n', 80)//TODO check if adding 'Output:' is also needed
    submit()
  }
}

bthread('train', function () {
  loadData()
  preparePlayground(MOVIE)
  train(MOVIE)
  test()
})
