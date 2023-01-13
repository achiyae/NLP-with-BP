// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'

bthread('train', function () {
  startSession(URL)

  changeStopSequence('Example:\n') //\n\n\n\n
  changeModel('code-davinci-002\n')
  changeLanguage('JavaScript\n')
  changeMaxTokens('1000')
  changeTemperature('0')
  topP('1')
  frequencyPenalty('0.2')
  presencePenalty('0')

  for (let i = 0; i < trainData.length; i++) {
    provideInstructions('Example: ' + trainData[i].requirement + '\n', i<2 ? 80 : 0)
    provideInstructions('Output:' + trainData[i].code, i<2 ? 80 : 0)
  }
  submit()
  for (let i = 0; i < testData.length; i++) {
    provideInstructions(testData[i]+'\n', 80)
    submit()
  }
})
