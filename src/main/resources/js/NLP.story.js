// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'
const MOVIE = false

function preparePlayground(movie) {
  startSession(URL)
  changeStopSequence('Example:\n/*\n') //\n\n\n\n
  changeModel('code-davinci-002\n')
  changeMaxTokens('1000')
  changeTemperature('0')
  topP('1')
  frequencyPenalty('0.2')
  presencePenalty('0')
  changeLanguage('JavaScript\n')
}


function train(movie) {
  if (movie) {
    for (let i = 0; i < trainData.length; i++) {
      writeInstructions('Example: ' + trainData[i].requirement + '\n', i < 2 ? 80 : 0)
      writeInstructions('Output:' + trainData[i].code, i < 2 ? 80 : 0)
    }
  } else {
    pasteInstructions(
      trainData.map(sample => 'Example: ' + sample.requirement + '\n' + 'Output:' + sample.code).join(''))
  }
  submit()
}

function test() {
  for (let i = 0; i < testData.length; i++) {
    writeInstructions(testData[i] + '\n', 80)
    submit()
  }
}

bthread('train', function () {
  preparePlayground(MOVIE)
  train(MOVIE)
  test()
})
