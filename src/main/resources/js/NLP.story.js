const URL = 'https://beta.openai.com/codex-javascript-sandbox'
// const URL = 'https://beta.openai.com/playground'

bthread('train', function () {
  startSession(URL)
  for (let i = 0; i < trainData.length; i++) {
    ProvideInstructions({ instructions: trainData[i].requirement + '\n' + trainData[i].code })
  }
})