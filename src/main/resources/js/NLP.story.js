// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'

bthread('train', function () {
  startSession(URL)
  changeStopSequence('Example:\n')
  changeModel('code-davinci-002\n')
  for (let i = 0; i < trainData.length; i++) {
    provideInstructions('Example: ' + trainData[i].requirement + '\nOutput:' + trainData[i].code)
  }
})